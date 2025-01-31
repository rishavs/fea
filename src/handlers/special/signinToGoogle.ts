import { customAlphabet } from "nanoid"
import { Context, ServerError } from "../../defs"

// create session id. set session in db. set session cookie
export const signinToGoogle = async (ctx: Context) : Promise<Response> => {

    // TODO - protect from abuse of just filling up the db with sessions

    // // ------------------------------------------
    // // check that data exists
    // // ------------------------------------------
    // if (!ctx.req.cookies.D_SID) {
    //     throw new ServerError("InvalidSession", "The session info cookie is missing")
    // }
    // if (!ctx.req.cookies.D_IS_SIGNEDIN) {
    //     throw new ServerError("InvalidSession", "The isSignedIn flag cookie is missing")
    // }
    // if (ctx.req.cookies.D_IS_SIGNEDIN === 'true') {
    //     throw new ServerError("InvalidSession", "The user is already signed in")
    // }

    let sid = ctx.req.cookies.D_SID
    let secToken = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)()
    let nonce = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)()
    let prevURL = ctx.req.raw.headers.get("Referer") || "/"
    console.log("Referred from:", ctx.req.raw.headers.get("Referer"))

    const resAddSecInfoToSession = await ctx.db.from('sessions')
    .update({
        sec_token: secToken,
        nonce: nonce,
        updated_at      : new Date(),
    })
    .eq('id', ctx.req.cookies['D_SID'])
    .select()
    if (resAddSecInfoToSession.error) throw resAddSecInfoToSession.error
    if (resAddSecInfoToSession.data.length === 0) {
        throw new ServerError("InvalidSession", "Failed to add the security info to session")
    }
    
    // ------------------------------------------
    // Build Google Oauth URL
    // ------------------------------------------
    let OauthURL = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code" +
    "&client_id=" + ctx.env.GOOGLE_CLIENT_ID +
    "&scope=" + "openid email" + 
    "&redirect_uri=" + ctx.req.url.origin + "/callback/google" +
    "&state=" + JSON.stringify({sid: sid, sec_token: secToken, redirect: prevURL}) +
    "&nonce=" + nonce

    console.log("Oauth URL", encodeURI(OauthURL))

    return Response.redirect(encodeURI(OauthURL), 302)
}