import { customAlphabet } from "nanoid"
import { Context, ServerError } from "../../defs"

export const signinToGoogle = async (ctx: Context) : Promise<Response> => {
    let url = new URL(ctx.req.url)
    let sid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)()
    let secToken = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)()
    let nonce = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)()
    let prevURL = ctx.req.raw.headers.get("Referer") || "/"
    console.log("Referred from:", ctx.req.raw.headers.get("Referer"))

    // TODO - protect from abuse of just filling up the db with sessions

    // ------------------------------------------
    // create session id. set session in db. set session cookie
    // ------------------------------------------
    let userAgent = ctx.req.raw.headers.get('User-Agent') || ""
    const addNewSession = await ctx.db.from('sessions').insert({
        id: sid,
        user_agent: userAgent,
        sec_token: secToken,
        nonce: nonce,
    }).select()
        
    if (addNewSession.error) {
        throw new ServerError("GoogleAuthError", JSON.stringify(addNewSession.error))
    }
    console.log (`session created in db: ${JSON.stringify(addNewSession.data)}`)
    
    // ------------------------------------------
    // Build Google Oauth URL
    // ------------------------------------------
    let OauthURL = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code" +
    "&client_id=" + ctx.env.GOOGLE_CLIENT_ID +
    "&scope=" + "openid email" + 
    "&redirect_uri=" + url.origin + "/callback/google" +
    "&state=" + JSON.stringify({sid: sid, sec_token: secToken, redirect: prevURL}) +
    "&nonce=" + nonce

    console.log("Oauth URL", encodeURI(OauthURL))

    return Response.redirect(OauthURL, 302)
}