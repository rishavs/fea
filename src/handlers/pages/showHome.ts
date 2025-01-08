import { Context, Page } from "../../defs"
import { buildHTML } from "../../views/buildHTML";

export const showHome = async (ctx: Context): Promise<Response> => {
    let page : Page = {
        title: "Home",
        content: `<h1>Welcome to the home page</h1>`,
        error: null
    }

    return new Response(buildHTML(page), { status: 200, headers: ctx.res.headers });
}