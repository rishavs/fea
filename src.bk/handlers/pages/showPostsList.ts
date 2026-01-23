import { Context, Page } from "../../defs";
import { buildPage } from "../../views/buildPage";

export const showPostsList = async (ctx: Context): Promise<Response> => {
    let url = new URL(ctx.req.url)
    let cat = url.pathname.split("/")[1]
    
    let page = {} as Page
    page.title = `Viewing List of Posts`
    page.content = /*html*/ `
<ul role="list" class="divide-y divide-slate-500 w-full">
    ${postCard}
    ${postCard}
    ${postCard}
    ${postCard}
    ${postCard}
    ${postCard}
</ul>

  `;
    return new Response(buildPage(ctx, page), { headers: ctx.res.headers });
}

let postCard = /*html*/ `
    <li class="flex justify-between gap-x-6 py-5">

    XXXX
    </li>
  `;