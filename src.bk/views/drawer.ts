import {
    CommunityLinks,
    LegalLinks,
    PostCategoriesRec
} from "../defs";

let navBuilder = (group: any) => {

    return Object.keys(group).map((link) => {
        return /*html*/ `
<li><a data-role="drawer-link" class="hover:underline" href="/${link}">
        ${group[link]}
    </a></li>
`
    }).join("")
}

export const drawer = () => {

    return /*html*/ `
<ul class="menu menu-lg bg-base-200 text-base-content min-h-full w-80 px-4 pt-24 overscroll-contain">

    <li>
        <details open>
            <summary class="group"> Category</summary>
            <ul class="flex flex-col gap-1 lg:gap-2">
                <li><a data-role="drawer-link" class="hover:underline" href="/">All</a></li>
                ${navBuilder(PostCategoriesRec)}
            </ul>
        </details>
    </li>
    <li>
        <details class="border-t border-base-300">
            <summary class="group"> Community</summary>
            <ul>
                ${navBuilder(CommunityLinks)}
            </ul>
        </details>
    </li>
    <li>
        <details class="border-t border-base-300">
            <summary class="group"> Legal</summary>
            <ul>
                ${navBuilder(LegalLinks)}
            </ul>
        </details>
    </li>
</ul>

<script>
    // match all link hrefs with the current url, and if matches, set link as active
    document.querySelectorAll('[data-role="drawer-link"]').forEach((link) => {
        if (link.href === window.location.href) {
            link.classList.add("active")
        }
    })
</script>
`
}