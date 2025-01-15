import { ServerError } from "../defs"

export const errorCard = (err: ServerError | null) => {
    if (!err) {
        err = new ServerError("InternalServerError", "Internal Server Error")
    }
    return /*html*/`
    <div class="card bg-error mt-16 rounded-none lg:rounded-box">
        <div class="card-body">
            <div class="card-actions justify-end">
                <button class="btn btn-square btn-sm" onclick="error_container.classList.add('hidden')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <article class="prose lg:prose-lg text-center self-center">
                <h1>☠ { <span id="error_code">${err.code}</span> }
                    <span id="error_header"> ${err.header} </span>
                </h1>
                <h3 id="error_details"> ${err.userMsg} </h3>
            </article>
        </div>
    </div>
    `
}