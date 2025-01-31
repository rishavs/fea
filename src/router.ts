import { createClient } from "@supabase/supabase-js";
import { parseCookies } from "./utils";
import { apiRoutes, Context, Page, pageRoutes, PostCategories, ServerError, Settings  } from "./defs";
import { buildPage } from "./views/buildPage";
import { customAlphabet } from "nanoid";
import { getUserFromSession } from "./handlers/helpers/getUserFromSession";
import { errorCard } from "./views/errorCard";


// Main route function
export const route = async (request: Request, env: Env) => {
    let url = new URL(request.url);

    // ------------------------------------------
    // Handle static assets
    // ------------------------------------------
    if (url.pathname.startsWith("/pub")) {
        return env.STATIC_FILES.fetch(request);
    }

    let ctx: Context = {
        req: {
            raw: request,
            url: url,
            params: {},
            isSignedIn: false,
            user: null,
            allow: ['admin'],
            cookies: parseCookies(request.headers.get('Cookie') || "")
        },
        res: {
            headers: new Headers(),
            status: 200,
            body: '',
        },
        env: env,
        db : createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY),
    }
    console.log("Cookies: ", ctx.req.cookies);
    
    // ------------------------------------------
    // Set Content type
    // ------------------------------------------
    ctx.res.headers.append('Content-Type', url.pathname.startsWith("/api") 
        ? 'application/json' 
        : 'text/html'
    )

    // ------------------------------------------
    // Handle API Routes
    // ------------------------------------------
    if (url.pathname.startsWith("/api")) {
        try {
            for (const {method, path, allow, handler } of apiRoutes) { 
                let match = path.exec(url);
                if (request.method === method && match) {
                    ctx.req.params = match.pathname.groups;
                    ctx.req.allow = allow;

                    if ( ctx.req.allow.includes("anonymous")) {
                        return await handler(ctx);
                    }

                    if (    ctx.req.allow.includes('user') 
                        ||  ctx.req.allow.includes('moderator') 
                        ||  ctx.req.allow.includes('admin')
                    ) {
                        let userDetailsFromSession = await ctx.db
                        .from('sessions')
                        .select('users(*)')
                        .eq('id', ctx.req.cookies.D_SID)
                        .limit(1)
                        .maybeSingle()
                        console.log("User Details from session: ", userDetailsFromSession)
                        if (userDetailsFromSession.error) throw userDetailsFromSession.error
                        if (userDetailsFromSession.data && userDetailsFromSession.data.users) {
                            ctx.req.user        = userDetailsFromSession.data.users as any
                            // Check if the user is allowed to access the resource
                            if (!ctx.req.allow.includes(ctx.req.user!.role)) {
                                throw new ServerError("UnauthorizedAccess", 
                                    `User with id: ${ctx.req.user?.id} & role: ${ctx.req.user?.role} attempted to access a restricted resource`)
                            }
                            return await handler(ctx);
                        } else {
                            // Error: User not found in session
                            throw new ServerError("MissingSession", "User not found in session for sid: " + ctx.req.cookies.D_SID)
                        }
                    } 
                } 
            } 
        } catch (err) {
            console.error("Error: ", err);
            if (err instanceof ServerError) {
                return new Response(JSON.stringify({ error: err.userMsg }), { status: err.code, headers: ctx.res.headers });
            } else {
                return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: ctx.res.headers });
            }
        }
    }

    // ------------------------------------------
    // Handle Page Routes
    // ------------------------------------------
    try {
        // ------------------------------------------
        // Set anonymous session
        // ------------------------------------------
        if (!ctx.req.cookies['D_SID']) {
            const addNewSession = await ctx.db.from('sessions').insert({
                id: customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)(),
                user_agent: ctx.req.raw.headers.get('User-Agent'),
            }).select()
            if (addNewSession.error) {
                throw new ServerError("InternalServerError", JSON.stringify(addNewSession.error))
            }
            ctx.res.headers.append('Set-Cookie', `D_SID=${addNewSession.data[0].id}; Max-Age=${Settings.maxSessionAge}; Path=/; Secure; HttpOnly; SameSite=Strict`)
            ctx.res.headers.append('Set-Cookie', `D_SEND_USER_INFO=true; Path=/; Secure; SameSite=Strict`)
        }

        // ------------------------------------------
        // Set user info cookie
        // ------------------------------------------
        if (!ctx.req.cookies['D_USER_INFO'] ) {
            // get the user info from the session.
            // always get this info for 1st time whens ession starts
            // D_USER_INFO being a session cookie will be absent for new sessions
            let userDetailsFromSession = await ctx.db
            .from('sessions')
            .select('users(*)')
            .eq('id', ctx.req.cookies.D_SID)
            .limit(1)
            .maybeSingle()
            if (userDetailsFromSession.error) throw userDetailsFromSession.error
            if (userDetailsFromSession.data && userDetailsFromSession.data.users) {
                ctx.req.user        = userDetailsFromSession.data.users as any
                // bake the user info into the session cookie
                ctx.res.headers.append(
                    'Set-Cookie', 
                    `D_USER_INFO=${JSON.stringify({
                        is_signed_in    : true,
                        slug            : ctx.req.user!.slug,
                        name            : ctx.req.user!.name,
                        thumb           : ctx.req.user!.thumb,
                        level           : ctx.req.user!.level,
                        stars           : ctx.req.user!.stars,
                        creds           : ctx.req.user!.creds,
                        gil             : ctx.req.user!.gil,
                        flair           : ctx.req.user!.flair,
                        ext_id          : ctx.req.user!.ext_id,
                    })}; Path=/; Secure; SameSite=Strict`
                )
            } else {
                ctx.res.headers.append(
                    'Set-Cookie', 
                    `D_USER_INFO=${JSON.stringify({
                        is_signed_in    : false
                    })}; Path=/; Secure; SameSite=Strict`
                )
            }
        }

        // Now, parse route and handle the page
        for (const {method, path, allow, handler } of pageRoutes) {
            let match = path.exec(url);
            if (request.method === method && match) {
                ctx.req.params = match.pathname.groups;
                ctx.req.allow = allow;

                if (ctx.req.params.cat && Object.values(PostCategories).includes(ctx.req.params.cat as PostCategories)
                ) {
                    throw new ServerError("PageNotFound", "Error 404: Invalid Category: " + ctx.req.params.cat)
                }
                // Note: all pages are public
                return await handler(ctx);
            } 
        }
        throw new ServerError("PageNotFound", "Error 404: " + url.pathname)
    } catch (err) {
        console.error("Error: ", err);

        let serverError: ServerError;
        if (err instanceof ServerError) {
            serverError = err;
        } else {
            serverError = new ServerError("InternalServerError", "Error 500: " + (err as Error).message)
        }
        
        // For errors without a dedicated page, redirect to the error page
        if (serverError.toErrorPage) {
            return Response.redirect (`/error/${serverError.header}`, 303);
        }

        // Else, render the error page in situ
        let page: Page = {
            title: serverError.header,
            content: errorCard(serverError),
        }        
        return new Response(buildPage(ctx, page), { status: serverError.code, headers: ctx.res.headers });
    }
};
