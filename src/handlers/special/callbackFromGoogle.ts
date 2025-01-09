import { createRemoteJWKSet, jwtVerify } from "jose"
import { Context, ServerError, Settings, User } from "../../defs"
import { parseCookies } from "../../utils"
import { customAlphabet } from "nanoid"
import { getRandomSlug } from "../slug"

export const callbackFromGoogle = async (ctx: Context) : Promise<Response> => {

    // ------------------------------------------
    // Read Query Params
    // ------------------------------------------
    let searchParams = new URLSearchParams(ctx.req.url.search)
    let cookies = parseCookies(ctx.req.raw.headers.get('Cookie') || "")

    let prevURL = ctx.req.raw.headers.get("Referer")
    console.log(prevURL)

    // console.log("Search Params", searchParams)
    let code = searchParams.get("code")
    let state = searchParams.get("state")
    if (!code) {
        throw new ServerError(503, "Unable to signin using the Google account. Please relogin to Google and try again.", "No signin code returned from Google")
    }
    if (!state) {
        throw new ServerError(503, "Unable to signin using the Google account. Please relogin to Google and try again.", "No signin state returned from Google")
    }
    let secToken = JSON.parse(state || "").state
    if (!secToken) {
        throw new ServerError(503, "Unable to signin using the Google account. Please relogin to Google and try again.", "No security token returned from Google")
    }
    let redirect = JSON.parse(state || "/").redirect

    // ------------------------------------------
    // Read the sec token & nonce from the cookies
    // ------------------------------------------
    let secTokenCookie = cookies.D_SECTOK
    let nonceCookie = cookies.D_NONCE
    if (!secTokenCookie) {
        throw new ServerError(503, "Unable to signin using the Google account. Please relogin to Google and try again.", "No security token found in the cookies")
    }
    if (!nonceCookie) {
        throw new ServerError(503, "Unable to signin using the Google account. Please relogin to Google and try again.", "No nonce found in the cookies")        
    }
    // console.log("Cookies", secTokenCookie, nonceCookie)
    // ------------------------------------------
    // Verify the Security Token
    // ------------------------------------------
    if (secToken != secTokenCookie) {
        throw new ServerError(503, "Unable to signin using the Google account. Please relogin to Google and try again.", "The security tokens do not match")
    }

    // ------------------------------------------
    // Get ID Token
    // ------------------------------------------
    let tokenReqBody = new URLSearchParams({
        code: code || "", // Ensure code is always a string
        client_id: ctx.env.GOOGLE_CLIENT_ID,
        client_secret: ctx.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: ctx.req.url.origin + "/callback/google",
        grant_type: "authorization_code"
    })

    // console.log("Token Req Body", tokenReqBody)

    let tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: tokenReqBody
    })

    if (!tokenResponse.ok) {
        let errorResponse = await tokenResponse.text(); // or .json() if the response is JSON
        throw new ServerError(503, "Unable to signin using the Google account. Please relogin to Google and try again.", 'Error in fetching id token: ' + errorResponse)
    } 

    let tokenData: any = await tokenResponse.json();
    // console.log("Token Data", tokenData);
    
    let idToken = tokenData.id_token
    if (!idToken) {
        throw new ServerError(503, "Unable to signin using the Google account. Please relogin to Google and try again.", 'No id token was returned from Google')
    }

    const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))
    const { payload } = await jwtVerify(idToken, JWKS, {
        issuer: 'https://accounts.google.com',
        audience: ctx.env.GOOGLE_CLIENT_ID
    })

    // ------------------------------------------
    // Validate Nonce
    // ------------------------------------------
    let nonce = payload.nonce
    if (!nonce) {
        throw new ServerError(503, "Unable to signin using the Google account. Please relogin to Google and try again.", 'Nonce was not found in the Google payload')
    }
    if (nonce != nonceCookie) {
        throw new ServerError(503, "Unable to signin using the Google account. Please relogin to Google and try again.", 'The Nonce values do not match')

    }

    // ------------------------------------------
    // Get user details from DB. Else add to db
    // ------------------------------------------
    let user = {} as User
    let doesUserExistsInDb = await ctx.db.from('users')
        .select('*')
        .eq('google_id', payload.email)

    if (doesUserExistsInDb.error) {
        throw new ServerError(500, "Unable to signin. Please try again later", JSON.stringify(doesUserExistsInDb.error))
    }
    console.log("doesUserExistsInDb", doesUserExistsInDb.data)

    if (doesUserExistsInDb.data.length == 0) {
        // let uid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 64)()

        console.log(`user doesn't exist`)

        // create new user with default values
        user.slug           = getRandomSlug()
        user.name           = "Nony Mouse"
        user.thumb          = ctx.env.SUPABASE_URL + '/storage/v1/object/public/avatars/default-0' + (Math.floor(Math.random() * (6 - 1 + 1)) + 1);
        user.honorific      = "Mx"
        user.flair          = "Nony is not a Mouse"
        user.role           = "user"
        user.level          = "wood"
        user.stars          = 0
        user.creds          = 0
        user.gil            = 0
        user.googleId      = payload.email as string
        user.extId         = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)()

        const addUserToDB = await ctx.db.from('users').insert({
            flair       : user.flair, 
            google_id   : user.googleId, 
            honorific   : user.honorific, 
            level       : user.level, 
            name        : user.name, 
            role        : user.role, 
            slug        : user.slug, 
            thumb       : user.thumb,
            ext_id      : user.extId
        }).select()

        if (addUserToDB.error) {
            throw new ServerError(503, "Unable to signin. Please try again later", JSON.stringify(addUserToDB.error))
        }
        console.log("Add User to DB", addUserToDB)
        user.id = addUserToDB.data[0].id

        // Trigger FRE for user
        ctx.res.headers.append('Set-Cookie', `D_FRE=true; path=/; SameSite=Strict;`)

    } else {
        console.log(`user exists`)
        user = doesUserExistsInDb.data[0]
    }

    // ------------------------------------------
    // create session id. set session in db. set session cookie
    // ------------------------------------------
    // TODO add navigator data to session. 

    // Create new POST api to send this info at session start
    // try {
    //     await env.BINDING_NAME.put("KEY", "VALUE");
    //     const value = await env.BINDING_NAME.get("KEY");
    //     if (value === null) {
    //       return new Response("Value not found", { status: 404 });
    //     }
    //     return new Response(value);
    // } catch (err) {
    //     // In a production application, you could instead choose to retry your KV
    //     // read or fall back to a default code path.
    //     console.error(`KV returned error: ${err}`);
    //     return new Response(err, { status: 500 });
    // }

    let userAgent = ctx.req.raw.headers.get('User-Agent') || ""
    const addNewSession = await ctx.db.from('sessions').insert({
        id: customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)(),
            user_id: user.id,
            user_agent: userAgent,
        }).select()
        
    if (addNewSession.error) {
        throw new ServerError(503, "Unable to signin. Please try again later", JSON.stringify(addNewSession.error))
    }
    console.log (`session created in db: ${JSON.stringify(addNewSession.data)}`)

    let maxAge = Settings.maxSessionAge // One year in seconds
    ctx.res.headers.append('Set-Cookie', `D_SID=${addNewSession.data[0].id}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Strict;`);

    // ------------------------------------------
    // Sync the user details with the browser
    // ------------------------------------------
    // Remove the ids from the user object
    delete user.id
    delete user.googleId
    delete user.appleId

    // send the user object in the cookie
    let userEncoded = encodeURIComponent(JSON.stringify(user))
    ctx.res.headers.append('Set-Cookie', `D_SYNC_USER=${userEncoded}; path=/; SameSite=Strict;`)

    // ------------------------------------------
    // Redirect to the original page
    // ------------------------------------------
    ctx.res.headers.append('Location', redirect)
    return new Response ('', {status: 302, headers: ctx.res.headers})
}