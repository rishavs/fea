import { createClient } from "@supabase/supabase-js";
import { parseCookies } from "./utils";
import { AppRoute, Context, Page } from "./defs";
import { ServerError } from "./defs";
import { buildHTML } from "./views/buildHTML";
import { showHome } from "./handlers/pages/showHome";
import { signinToGoogle } from "./handlers/special/signinToGoogle";
import { callbackFromGoogle } from "./handlers/special/callbackFromGoogle";
import { signout } from "./handlers/special/signout";
import { showPostsList } from "./handlers/pages/showPostsList";
import { showPostDetails } from "./handlers/pages/showPostDetails";
import { showNewPost } from "./handlers/pages/showNewPost";
import { getUserFromSession } from "./handlers/helpers/getUserFromSession";
import { PostCategories } from "../pub/sharedDefs";
import { showUserDetails } from "./handlers/pages/showUserDetails";
import { updateUserDetails } from "./handlers/apis/updateUserDetails";
import { saveNewPost } from "./handlers/apis/saveNewPost";
import { buildPage } from "./views/buildPage";

const setPath = (str: string) => {
    return new URLPattern({ pathname: str }) 
}

const routes: AppRoute[] = [
    { method: 'GET', path: setPath('/'), allow: [], handler: showHome },
    { method: 'GET', path: setPath('/p/new'), allow: [], handler: showNewPost, },
    // { method: 'GET', path: setPath('/throw'), allow: [], handler: () => {throw new ServerError400("I threw a 400 err")}, },

    { method: 'GET', path: setPath(`/signin/google`), allow: [], handler: signinToGoogle,  },
    { method: 'GET', path: setPath(`/callback/google`), allow: [], handler: callbackFromGoogle, },    
    { method: 'GET', path: setPath(`/signout`), allow: [], handler: signout, },
    
    { method: 'POST', path: setPath(`/api/update-user-details`), allow: ['user', 'moderator', 'admin'], handler: updateUserDetails, },
    { method: 'POST', path: setPath(`/api/save-new-post`), allow: ['user', 'moderator', 'admin'], handler: saveNewPost, },

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
    
    // ------------------------------------------
    // Set Content type
    // ------------------------------------------
    ctx.res.headers.append('Content-Type', url.pathname.startsWith("/api") 
        ? 'application/json' 
        : 'text/html'
    )

    // ------------------------------------------
    // Handle Routes
    // ------------------------------------------
    try {
        for (const {method, path, allow, handler } of routes) {
            let match = path.exec(url);
            if (request.method === method && match) {
                // if (route.protected) {
                //     fetch the userid from session
                // }
                ctx.req.params = match.pathname.groups;
                if (ctx.req.params.cat && 
                    !Object.keys(PostCategories).includes(ctx.req.params.cat)
                ) {
                    throw new ServerError(404, 'The page you are looking for is in another castle')
                }
                // Auth check + Role based access control
                if (allow.length > 0 ) await getUserFromSession(ctx, {method, path, allow, handler});

                return await handler(ctx);
            } 
        }
        throw new ServerError(404, 'The page you are looking for, is in another castle')

    } catch (err) {
        let serverError: ServerError;
        if (err instanceof ServerError) {
            serverError = err;
        } else {
            serverError = new ServerError(500, "Oh no! The server just shattered into a million pieces. But don't worry. We have our best hamsters on the job ", (err as Error).message)
        }
        console.error("Server Error: ", serverError);
        
        if (url.pathname.startsWith("/api")) {
            return new Response(JSON.stringify({ error: serverError.details }), { status: serverError.code, headers: ctx.res.headers });
        }

        let page: Page = {
            title: serverError.header,
            content: '',
            error: serverError,
        }
        return new Response(buildPage(page), { status: serverError.code, headers: ctx.res.headers });
        // Default response if no pattern matches
    }
};