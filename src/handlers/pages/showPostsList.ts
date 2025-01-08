import { Context, Page } from "../../defs";
import { buildHTML } from "../../views/buildHTML";

export const showPostsList = async (ctx: Context): Promise<Response> => {
    let url = new URL(ctx.req.url)
    let cat = url.pathname.split("/")[1]
    
    let page: Page = {
        title : `Viewing List of Posts`,
        content: `<h1>Viewing Posts for cat ${cat}</h1>`,
        error: null
    }
    return new Response(buildHTML(page), { headers: ctx.res.headers });
}