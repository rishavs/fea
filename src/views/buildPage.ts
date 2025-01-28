import {
    Context,
    Page
} from '../defs';
import {
    drawer
} from './drawer';
import {
    errorCard
} from './errorCard';
import {
    freModal
} from './freModal';
import {
    header
} from './header';

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
        };
        (function(){d=document;s=d.createElement("script");s.src="https://cdn.jsdelivr.net/npm/gumlet.js@2.2/dist/gumlet.min.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
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
                <div class="drawer-content flex flex-col items-center justify-center">
                    <!-- Page content here -->

                    <!-----------------------
                    Header Content
                    ------------------------>
                    <header id="header_container" class="navbar sticky top-0 bg-info opacity-90 rounded-b-box lg:rounded-box border border-base-300 shadow-lg h-8 lg:h-20 z-10 px-4 lg:px-8">
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
                    Error View container
                    ------------------------>
                    <div id="error_container" class="${page.error ? '' : 'hidden'
        }"> ${errorCard(page.error)} </div>

                    <!-----------------------
                    Main Page Content
                    ------------------------>
                    <main id="main_container" class="contents"> ${page.content} </main>


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