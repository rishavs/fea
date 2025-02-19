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
    <ul role="list" class="flex w-full flex-col gap-2 lg:gap-4 bg-base-200 ">
    
        ${postsListCard()}
        ${postsListCard()}
        ${postsListCard()}
        ${postsListCard()}
        ${postsListCard()}
        ${postsListCard()}
        ${postsListCard()}
        ${postsListCard()}
        ${postsListCard()}
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