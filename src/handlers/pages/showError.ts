
import { Context, Page, ServerError, ServerErrorHeaderType, ServerErrorMessages } from "../../defs";
import { buildPage } from "../../views/buildPage";


export const showError = async (ctx: Context): Promise<Response> => {
    let url = new URL(ctx.req.url)
    let fragments = url.pathname.split("/")
    let errorHeader = fragments[2] ? fragments[2] as ServerErrorHeaderType : null;
    let sError: ServerError;
    console.log("URL split", url.pathname.split("/"))

    // If this is a handled error, render the specific error page
    if (errorHeader && errorHeader in ServerErrorMessages) {
        console.log("Found matching error header: ", errorHeader)
        sError = new ServerError(errorHeader, ServerErrorMessages[errorHeader].userMsg)
    } else {
        console.log("No matching error header found. Rendering generic error page.", errorHeader)
        sError = new ServerError("InternalServerError", "Internal Server Error")
    }

    // Else, render a generic error page
    let page: Page = {
        title: `Error: ${ errorHeader }`,
        content: '',
        error: sError,
    }

    return new Response(buildPage(page), { headers: ctx.res.headers });

}