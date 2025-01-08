import { Context, Page } from "../../defs";
import { buildHTML } from "../../views/buildHTML";

export const showPostDetails = async (ctx: Context): Promise<Response> => {
    let page = {
        title : `Viewing Post ${ctx.req.params.id}`,
        content: `<h1>Viewing Post ${ctx.req.params.id}</h1>`,
        error: null
    }
    return new Response(buildHTML(page), { headers: ctx.res.headers });
}