import { Context, Page } from '../defs';
import { drawer } from './drawer';
import { errorCard } from './errorCard';
import { freModal } from './freModal';
import { header } from './header';

export const buildPage = (ctx: Context, page: Page) => {
	return /*html*/ `
<!DOCTYPE html>
<html lang="en" data-theme="nord" dir="ltr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="referrer" content='strict-origin-when-cross-origin'>

    <title>Digglu: ${page.title}</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">

    <meta name="description" content="">

    <meta property="og:type" content="article">
    <meta property="og:title" content="">

    <link href="/main.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
        window.GUMLET_CONFIG = {
            hosts: [{
                current: "digglu.gumlet.io",
                gumlet: "digglu.gumlet.io"
            }],
            auto_webp: true,
            lazy_load: true,
        };
        (function(){d=document;s=d.createElement("script");s.src="https://cdn.jsdelivr.net/npm/gumlet.js@2.2/dist/gumlet.min.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
    </script>

    <script type="text/javascript">
        // ---------------------------------------
        // Create CLient side context
        // ---------------------------------------
        let app = {}
        app.cookies = Object.fromEntries(
            document.cookie
            .split(';')
            .map(cookie => cookie.trim().split('=')) // Trim whitespace and split
            .map(([key, value]) => [key, decodeURIComponent(value)]) // Decode values
        );
        app.user = app.cookies['D_USER_INFO'] ? JSON.parse(app.cookies['D_USER_INFO']) : null;

        // Methods
        app.eatCookie = (cookieName) => {
            if (app.cookies[cookieName]) {
                document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
        }
        app.showErrorCard = (code, header, details) => {
            document.getElementById("error_code").innerText = code
            document.getElementById("error_header").innerText = header
            document.getElementById("error_details").innerText = details
            document.getElementById("error_container").classList.remove("hidden")
        }

    </script>
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
                    Client-side Error View 
                    ------------------------>
                    
                    <div id="error_banner" role="alert" class="hidden alert alert-error my-4 w-full">

                        <svg xmlns="http://www.w3.org/2000/svg" class="size-6" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M368 128c0 44.4-25.4 83.5-64 106.4l0 21.6c0 17.7-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32l0-21.6c-38.6-23-64-62.1-64-106.4C80 57.3 144.5 0 224 0s144 57.3 144 128zM168 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM3.4 273.7c7.9-15.8 27.1-22.2 42.9-14.3L224 348.2l177.7-88.8c15.8-7.9 35-1.5 42.9 14.3s1.5 35-14.3 42.9L295.6 384l134.8 67.4c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3L224 419.8 46.3 508.6c-15.8 7.9-35 1.5-42.9-14.3s-1.5-35 14.3-42.9L152.4 384 17.7 316.6C1.9 308.7-4.5 289.5 3.4 273.7z"/></svg>
                  
                        <div>
                            <h2 class="font-bold">New message!</h3>
                            <p class="">You have 1 unread message</p>
                        </div>
                        <button class="btn btn-square btn-sm" onclick="error_banner.classList.add('hidden')">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <!-----------------------
                    Main Page Content
                    ------------------------>
                    <main id="main_container" class="contents"> 
                        ${page.content} 
                    </main>


                </div>
                <div class="drawer-side">
                    <label for="right-sidebar" aria-label="close sidebar" class="drawer-overlay"></label>
                    <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        <!-- Sidebar content here -->
                        <li><a>RIGHT Sidebar Item 1</a></li>
                        <li><a>RIGHT Sidebar Item 2</a></li>
                    </ul>
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


    <script src="/main.js" type="module"></script>

</body>

</html>
`;
};
