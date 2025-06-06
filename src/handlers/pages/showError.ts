
import { Context, Page, ServerError, ServerErrorHeaderType, ServerErrorMessages } from "../../defs";
import { buildPage } from "../../views/buildPage";
import { errorCard } from "../../views/errorCard";


export const showError = async (ctx: Context): Promise<Response> => {
    let errorHeader = ctx.req.params.slug ? ctx.req.params.slug as ServerErrorHeaderType : null;
    let sError: ServerError;

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
        title: `Error: ${errorHeader}`,
        content: errorCard(sError),
    }

    return new Response(buildPage(ctx, page), { headers: ctx.res.headers });

}