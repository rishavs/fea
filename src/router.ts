import { createClient } from "@supabase/supabase-js";
import { parseCookies } from "./utils";
import { AppRoute, Context, Page, ServerError  } from "./defs";
import { buildHTML } from "./views/buildHTML";
import { showHome } from "./handlers/pages/showHome";
import { signinToGoogle } from "./handlers/special/signinToGoogle";
import { callbackFromGoogle } from "./handlers/special/callbackFromGoogle";
import { signout } from "./handlers/special/signout";
import { showPostsList } from "./handlers/pages/showPostsList";
import { showPostDetails } from "./handlers/pages/showPostDetails";
import { showNewPost } from "./handlers/pages/showNewPost";
// import { getUserFromSession } from "./handlers/helpers/getUserFromSession";
import { PostCategories } from "../pub/sharedDefs";
import { showUserDetails } from "./handlers/pages/showUserDetails";
// import { updateUserDetails } from "./handlers/apis/updateUserDetails";
// import { saveNewPost } from "./handlers/apis/saveNewPost";
import { buildPage } from "./views/buildPage";
import { showError } from "./handlers/pages/showError";
import { customAlphabet } from "nanoid";
import { addUserInfoToSession } from "./handlers/apis/addUserInfoToSession";
import { getUserFromSession } from "./handlers/helpers/getUserFromSession";

const setPath = (str: string) => {
    return new URLPattern({ pathname: str }) 
}

const routes: AppRoute[] = [
    // Static routes
    { method: 'GET', path: setPath('/'), allow: [], handler: showHome },
    { method: 'GET', path: setPath('/p/new'), allow: [], handler: showNewPost, },
    // { method: 'GET', path: setPath('/throw'), allow: [], handler: () => {throw new ServerError400("I threw a 400 err")}, },

    // Special routes
    { method: 'GET', path: setPath(`/signin/google`), allow: [], handler: signinToGoogle,  },
    { method: 'GET', path: setPath(`/callback/google`), allow: [], handler: callbackFromGoogle, },    
    { method: 'GET', path: setPath(`/signout`), allow: [], handler: signout, },
    
    // API routes
    { method: 'POST', path: setPath(`/api/save-user-info`), allow: ['user', 'moderator', 'admin'], handler: addUserInfoToSession, },
    // { method: 'POST', path: setPath(`/api/update-user-details`), allow: ['user', 'moderator', 'admin'], handler: updateUserDetails, },
    // { method: 'POST', path: setPath(`/api/save-new-post`), allow: ['user', 'moderator', 'admin'], handler: saveNewPost, },

    // Dynamic error routes
    { method: 'GET', path: setPath(`/error/:id`), allow: [], handler: showError },

    // Dynamic routes
    { method: 'GET', path: setPath(`/user/:slug`), allow: [], handler: showUserDetails },
    { method: 'GET', path: setPath(`/:cat`), allow: [], handler: showPostsList },
    { method: 'GET', path: setPath(`/:cat/:id`), allow: [], handler: showPostDetails },
];

// Main route function
export const route = async (request: Request, env: Env) => {
    let url = new URL(request.url);

    // ------------------------------------------
    // Handle static assets
    // ------------------------------------------
    if (url.pathname.startsWith("/pub")) {
        return env.ASSETS.fetch(request);
    }

    let ctx: Context = {
        req: {
            raw: request,
            url: url,
            params: {},
            sid: null,
            isAuthenticated: false,
            user: null,
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
        console.log (`session created in db: ${JSON.stringify(addNewSession.data)}`)
        ctx.res.headers.append('Set-Cookie', `D_SID=${addNewSession.data[0].id}; Max-Age=86400; Path=/; Secure; HttpOnly; SameSite=Strict`)
        // Have the browser send the user info
        ctx.res.headers.append('Set-Cookie', `D_SEND_USER_INFO=true;`)
    }

    // ------------------------------------------
    // Handle Routes
    // ------------------------------------------
    try {
        for (const {method, path, allow, handler } of routes) {
            let match = path.exec(url);
            if (request.method === method && match) {
                ctx.req.params = match.pathname.groups;
                if (ctx.req.params.cat && 
                    !Object.keys(PostCategories).includes(ctx.req.params.cat)
                ) {
                    throw new ServerError("PageNotFound", "Error 404: Invalid Category: " + ctx.req.params.cat)
                }
                // Auth check + Role based access control
                if (allow.length > 0 ) await getUserFromSession(ctx, {method, path, allow, handler});

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
        
        if (url.pathname.startsWith("/api")) {
            return new Response(JSON.stringify({ error: serverError.userMsg }), { status: serverError.code, headers: ctx.res.headers });
        }

        // For errors without a dedicated page, redirect to the error page
        if (serverError.toErrorPage) {
            return Response.redirect (`/error/${serverError.header}`, 303);
        }

        // Else, render the error page in situ
        let page: Page = {
            title: serverError.header,
            content: '',
            error: serverError,
        }        
        return new Response(buildPage(page), { status: serverError.code, headers: ctx.res.headers });
    }
};