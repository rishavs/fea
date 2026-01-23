
import { Context, Page } from "../../defs";
import { buildPage } from "../../views/buildPage";


export const showUserDetails = async (ctx: Context): Promise<Response> => {
    let url = new URL(ctx.req.url)
    let cat = url.pathname.split("/")[1]
    
    let page : Page = {
        title : `Viewing user details for ${ ctx.req.params.slug}`,
        content: `<h1>Page is ${cat}. Viewing user details for ${ ctx.req.params.slug}</h1>`,
        error: null
    }
    return new Response(buildPage(ctx, page), { headers: ctx.res.headers });
}