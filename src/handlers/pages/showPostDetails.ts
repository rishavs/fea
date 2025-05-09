import { Context, Page } from "../../defs";
import { buildPage } from "../../views/buildPage";

export const showPostDetails = async (ctx: Context): Promise<Response> => {
    let page = {} as Page
    page.title = `Viewing Post ${ctx.req.params.slug}`
    page.content = /*html*/`
<article>
    <div class="my-4 flex w-full flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-4 shadow-lg lg:gap-4 lg:p-4">
        <span class="badge">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4 fill-accent lg:size-6" viewBox="0 0 512 512">
            <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
            <path d="M493.7 .9L299.4 75.6l2.3-29.3c1-12.8-12.8-21.5-24-15.1L101.3 133.4C38.6 169.7 0 236.6 0 309C0 421.1 90.9 512 203 512c72.4 0 139.4-38.6 175.7-101.3L480.8 234.3c6.5-11.1-2.2-25-15.1-24l-29.3 2.3L511.1 18.3c.6-1.5 .9-3.2 .9-4.8C512 6 506 0 498.5 0c-1.7 0-3.3 .3-4.8 .9zM192 192a128 128 0 1 1 0 256 128 128 0 1 1 0-256zm0 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm16 96a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
        </svg>
        <span> Trending Post! </span>
        </span>

        <hr class="border-base-300" />

        <div class="tooltip before:delay-500! after:delay-500!">
        <div class="tooltip-content delay-500!">
            <div class="inline-flex items-baseline">
            <img src="https://picsum.photos/200" class="size-4 self-center rounded-field lg:size-6" />
            <span class="px-2">www.google.com</span>
            </div>
        </div>
        <a class="line-clamp-3 link link-hover">
            <span class="inline-flex items-baseline">
            <img src="https://picsum.photos/200" class="size-4 self-center rounded-field lg:size-6" />
            <span>&thinsp;</span>
            </span>
            <span class="prose prose-sm font-semibold lg:prose-lg"> Dio Lupa captivated audiences with its intense energy and mysterious lyrics its haunting sound and emotional depth. A viral performance brought it widespread captivated audiences with its intense energy and mysterious lyrics its haunting sound and emotional depth</span>
        </a>
        </div>

        <img alt="thumbnail" src="https://picsum.photos/200" class="aspect-5/3 max-h-64 rounded-box object-cover" />

        <p class="flex gap-2 opacity-60 lg:gap-4">
        <span>
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4 lg:size-6" viewBox="0 0 448 512">
            <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
            <path d="M0 216C0 149.7 53.7 96 120 96l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72zm256 0c0-66.3 53.7-120 120-120l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72z" />
            </svg>
        </span>
        <span class="prose prose-sm max-w-none italic lg:prose-base">Remaining Reason became an instant hit, praised for its haunting sound and emotional depth. A viral performance brought it widespread recognition, making it one of Dio Lupa’s most iconic tracks. Remaining Reason became an instant hit, praised for its haunting sound and emotional depth. A viral performance brought it widespread recognition</span>

        <span>
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4 lg:size-6" viewBox="0 0 448 512">
            <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
            <path d="M448 296c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 32 0 32 0 72zm-256 0c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 32 0 32 0 72z" />
            </svg>
        </span>
        </p>

        <hr class="border-base-300" />

        <div class="flex flex-wrap gap-1">
        <a class="btn link btn-xs link-hover opacity-60 btn-ghost lg:btn-md">#Tech</a>
        <a class="btn link btn-xs link-hover opacity-60 btn-ghost lg:btn-md">#Humour</a>
        </div>
        <hr class="border-base-300" />

        <div class="flex justify-between gap-2">
        <div class="flex gap-2">
            <img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp" />
            <div class="flex flex-col justify-between">
            <div class="link text-xs lg:text-sm link-hover">Count Dio Lupa Berrius the third</div>
            <div class="text-xs opacity-60">She/Her</div>
            </div>
        </div>

        <span class="badge badge-sm opacity-60">12 hrs ago</span>
        </div>

        <hr class="border-base-300" />

        <span class="prose prose-sm max-w-none lg:prose-base">Remaining Reason became an instant hit, praised for its haunting sound and emotional depth. A viral performance brought it widespread recognition, making it one of Dio Lupa’s most iconic tracks. Remaining Reason became an instant hit, praised for its haunting sound and emotional depth. A viral performance brought it widespread recognition</span>

        <div class="-mx-1 rounded-box border border-base-300 bg-base-200 shadow-inner">
        <div class="m-1 flex justify-between rounded-box bg-base-100 shadow">
            <div class="join">
            <button class="btn w-18 rounded-box rounded-r-none btn-sm btn-soft btn-warning lg:w-48 lg:btn-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4 lg:size-6" viewBox="0 0 512 512" fill="currentColor">
                <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z" />
                </svg>
                <span class="">999</span>
            </button>
            </div>

            <div class="float-end join">
            <div class="tooltip before:delay-500! after:delay-500!" data-tip="hello">
                <button class="btn btn-square rounded-none btn-sm opacity-60 btn-ghost lg:btn-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4 lg:size-6" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M0 48C0 21.5 21.5 0 48 0l0 48 0 393.4 130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4 336 48 48 48 48 0 336 0c26.5 0 48 21.5 48 48l0 440c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488L0 48z" />
                </svg>
                </button>
            </div>

            <a class="btn w-18 link rounded-box rounded-l-none btn-sm link-hover btn-error btn-soft lg:w-48 lg:btn-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4 lg:size-6" viewBox="0 0 512 512" fill="currentColor">
                <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                <path d="M160 368c26.5 0 48 21.5 48 48l0 16 72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6L448 368c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L64 48c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l96 0zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3l0-21.3 0-6.4 0-.3 0-4 0-48-48 0-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L448 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-138.7 0L208 492z" />
                </svg>
                <span class="">999</span>
            </a>
            </div>
        </div>
        </div>

        <hr class="border-base-300" />

        <form id="xxx" class="flex w-full flex-col gap-2">
        <fieldset class="fieldset">
            <label class="flex justify-between">
            <legend class="fieldset-legend">Reply to post</legend>
            <span class="fieldset-label">0/1024 chars</span>
            </label>

            <textarea class="textarea w-full" placeholder="Bio"></textarea>
        </fieldset>

        <button class="btn self-end btn-primary">Save</button>
        </form>
    </div>
    <!-----------------------
        Comments
    ------------------------>


</article>
`
    return new Response(buildPage(ctx, page), { headers: ctx.res.headers });
}
