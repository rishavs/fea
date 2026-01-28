import { HTMLResponse } from '../models/responses';
import { drawer } from './fragments/drawer';
import { freModal } from './fragments/freModal';
import { header } from './fragments/header';

export const buildHTML = (html: HTMLResponse) => {
	return /*html*/ `
<!DOCTYPE html>
<html lang="en" data-theme="nord" dir="ltr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="referrer" content='strict-origin-when-cross-origin'>
    
    <meta name="description" content="${html.description}">

    <meta property="og:type" content="article">
    <meta property="og:title" content="${html.title}">
    <meta property="og:description" content="${html.description}">
    
    <title>Digglu: ${html.title}</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">


    <link href="/main.css" rel="stylesheet">

</head>

<body class="min-h-screen bg-base-200">

    <!-- left drawer -->
    <div class="drawer lg:drawer-open">
        <input id="left-sidebar" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col items-center justify-center">

            <!-- right drawer -->
            <div class="drawer drawer-end lg:drawer-open">
                <input id="right-sidebar" type="checkbox" class="drawer-toggle" />
                <div class="drawer-content flex flex-col items-center justify-center border border-base-300 px-1 lg:px-4">

                    <!-----------------------
                    Header Content
                    ------------------------>
                    <header id="header_container" class="navbar sticky top-0 bg-primary opacity-90 rounded-b-box lg:rounded-box border border-base-300 shadow-lg h-8 lg:h-20 px-4 lg:px-6 lg:mt-24 z-10 mb-2 lg:mb-4">
                        ${header()}
                    </header>

                    <div id="sticky_container" class="sticky top-0"> </div>

                    <!-----------------------
                    Noscript Content
                    ------------------------>
                    <noscript>
                        <article class="prose lg:prose-lg text-center pt-16">
                            <h1>Error: Javascript is disabled.</h1>
                            <br>
                            <h3>Digglu needs Javascript to function properly.</h3>
                            <h3>Please enable Javascript in your browser and refresh the page. </h3>
                            <br>
                            <br>
                            <small> <i> " Without script's embrace,</i></small>
                            <small> <i> Digglu loses its grace,</i></small>
                            <small> <i> Lost in cyberspace. " </i></small>
                        </article>
                    </noscript>

                    <!-----------------------
                    Errors Bar
                    ------------------------>
                    <div id="client_error_bar" role="alert" class="alert alert-error w-full "> ☠ 
                        <span id="client_error_bar_message" class="text-base">Error! Task failed successfully.</span>

                        <button id="client_error_bar_close_action" class="btn btn-square btn-sm lg:btn-md text-error" onclick="client_error_bar.classList.add('hidden')">🗙</button>
                    </div>

                    <!-----------------------
                    Main Page Content
                    ------------------------>
                    <main id="main_container" class="contents"> 
                        ${html.page} 
                    </main>

                </div>
                <div class="drawer-side">
                    <div class="text-left flex flex-col gap-8 px-4 min-h-full pt-24 overscroll-contain">
                        ${html.cards}
                    </div>
                </div>
            </div>
        </div>
        <div class="drawer-side">
            <label for="left-sidebar" aria-label="close sidebar" class="drawer-overlay"></label>
            ${drawer()}
        </div>
    </div>

    <div id="modals_container">
        ${freModal()}
    </div>
    <div id="toasts_container" class="toast toast-top toast-end mt-16 z-100">
    </div>
    <div id="floaters_container"></div>

    <script src="https://unpkg.com/overtype"></script>
    <script src="/main.js" type="module" defer></script>

</body>

</html>
`;
};
