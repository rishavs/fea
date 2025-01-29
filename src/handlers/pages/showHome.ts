import {
    Context,
    Page
} from '../../defs';
import {
    buildPage
} from '../../views/buildPage';
import {
    postsListCard
} from '../../views/postsListCard';

export const showHome = async (ctx: Context): Promise < Response > => {
    let page: Page = {
        title: 'Home',
        content: /*html*/ `
    <ul class="list w-full bg-base-200 shadow-md">

        <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played songs this week</li>

        ${postsListCard()}
        ${postsListCard()}
        ${postsListCard()}
        ${postsListCard()}
        ${postsListCard()}
        ${postsListCard()}
    </ul>
    `,
    };

    return new Response(buildPage(ctx, page), {
        status: 200,
        headers: ctx.res.headers
    });
};