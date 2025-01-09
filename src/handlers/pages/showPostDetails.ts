import { Context, Page } from "../../defs";
import { buildPage } from "../../views/buildPage";

export const showPostDetails = async (ctx: Context): Promise<Response> => {
    let page = {
        title : `Viewing Post ${ctx.req.params.slug}`,
        content: `<h1>Viewing Post ${ctx.req.params.slug}</h1>`,
        error: null
    }
    return new Response(buildPage(page), { headers: ctx.res.headers });
}