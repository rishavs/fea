export const userButton = () => {
    return /*html*/`
<a class="btn flex justify-start border-base-300 shadow py-0 pl-0 w-fit">
    <img loading="lazy" data-role="user-profile-img" class="h-full rounded-lg rounded-r-badge border border-base-300 shadow" src="" />
    <span class="w-32 text-start gap-1">
        <p data-role= "user-profile-name" class="truncate"></p>
        <span data-role= "user-profile-pronouns" class="badge badge-xs opacity-50">she/her</span>
    </span>
</a>
    `
}