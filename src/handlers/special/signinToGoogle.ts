import { customAlphabet } from "nanoid"
import { Context } from "../../defs"

export const signinToGoogle = async (ctx: Context) : Promise<Response> => {
    let url = new URL(ctx.req.url)
    let secToken = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)()
    let nonce = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)()
    let prevURL = ctx.req.raw.headers.get("Referer") || "/"
    console.log("Referred from:", ctx.req.raw.headers.get("Referer"))
    // ------------------------------------------
    // Build Google Oauth URL
    // ------------------------------------------
    let OauthURL = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code" +
    "&client_id=" + ctx.env.GOOGLE_CLIENT_ID +
    "&scope=" + "openid email" + 
    "&redirect_uri=" + url.origin + "/callback/google" +
    "&state=" + JSON.stringify({state: secToken, redirect: prevURL}) +
    "&nonce=" + nonce

    console.log("Oauth URL", encodeURI(OauthURL))

    // ------------------------------------------
    // Generate state token & nonce. Add to session cookie
    // ------------------------------------------
    ctx.res.headers.append('Set-Cookie', `D_SECTOK=${secToken}; path=/; SameSite=Strict;`)
    ctx.res.headers.append('Set-Cookie', `D_NONCE=${nonce}; path=/; SameSite=Strict;`)
    
    // set window location
    ctx.res.headers.append('Location', OauthURL)
    return new Response('', {headers: ctx.res.headers, status: 302})
}