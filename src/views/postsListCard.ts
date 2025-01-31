export const postsListCard = () => {
    return /*html*/ `
<li class="list-row">
    <button class="btn h-36"> 999 digs</button>
    <div class="size-36">
        <img class="rounded-box" data-src="https://digglu.gumlet.io/default_${Math.floor(Math.random() * 30 - 10 + 1) + 10}.png" alt="Gumlet Logo">
    </div>
    <div class="list-col-grow">
        <div>Sabrino Gardener</div>
        <div class="text-xs uppercase font-semibold opacity-60">Cappuccino</div>
    </div>
    <button class="btn h-36 btn-ghost">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor">
                <path d="M6 3L20 12 6 21 6 3z"></path>
            </g>
        </svg>
    </button>
</li>
`
}