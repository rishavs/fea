import { Page } from "../defs"
import { drawer } from "./drawer"
import { errorCard } from "./errorCard"
import { freModal } from "./freModal"
import { header } from "./header"

export const buildHTML = (page: Page) => {
    return /*html*/`
    <!DOCTYPE html>
    <html lang="en" data-theme="winter" dir="ltr">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="referrer" content='strict-origin-when-cross-origin'>

            <title>Digglu: ${page.title}</title>
            <link rel="icon" type="image/x-icon" href="/pub/favicon.ico">

            <meta name="description" content="">
            <head prefix="og: http://ogp.me/ns#">
            <meta property="og:type" content="article">
            <meta property="og:title" content="">

            <link href="/styles.css" rel="stylesheet" type="text/css">
        </head>

        <body class="min-h-screen bg-base-200">

            <!-- left drawer -->
            <div class="drawer">
            
                <!-- Left nav slider. For mobile -->
                <input id="left-drawer" type="checkbox" class="drawer-toggle">
                <div class="drawer-side z-20">
                    <label for="left-drawer" class="drawer-overlay"></label>
                    ${drawer()}
                </div>
                
                <div class="drawer-content flex">
        
                    <!-- Left fixed Panel. For lg screens -->
                    <aside id="drawer_container" class="hidden lg:flex justify-end items-start grow min-w-80 border border-base-300 pt-48">
                    ${drawer()}
                    </aside>
                    
                    <!-- Central Column -->
                    <div class="grow-0 w-full lg:min-w-[128] lg:w-[50rem] lg:pt-8 lg:px-4">
        
                    <!-- Header Content -->
                        <header id="header_container" class="navbar sticky top-0 bg-info opacity-90 rounded-b-box lg:rounded-box border border-base-300 shadow-lg h-8 lg:h-20 z-10 px-4 lg:px-8">
                        ${header()}
                        </header>

                        <div id = "sticky_container" class="sticky top-0"> </div>

                        <!-----------------------
                        Noscript Content
                        ------------------------>
                        <noscript >
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
                        <div id="error_container" class="${page.error ? '' : 'hidden'}"> ${errorCard(page.error)} </div>
                        
                        <!-----------------------
                        Main Page Content
                        ------------------------>
                        <main id="main_container"> ${page.content} </main>
                    </div>
        
                    <!-- Right Sidepanel -->
                    <aside id="sidePanel_container" class="hidden lg:flex justify-start grow min-w-80 pt-48 flex-col gap-4"> 
                        <div id="topPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                        <div id="trendingPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                        <div id="discussionPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                        <div id="latestPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                        <div id="historyPosts_container" class="border border-base-300 shadow-xl rounded-box bg-base-100 w-80 h-96" ></div>
                    </aside>
                                        
                </div>
            </div>
            <div id = "modals_container">
                ${freModal()}
            </div>
            <div id = "toasts_container" class="toast toast-top toast-end mt-16 z-100">
            </div>
            <div id = "floaters_container"></div>

            <script src="/pub/main.js" type="module"></script>

        </body>
    </html>
    `
}