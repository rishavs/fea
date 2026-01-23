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
    console.log("Search Params", searchParams)
    let code = searchParams.get("code")
    if (!code) {
        throw new ServerError("GoogleAuthError", "No signin code returned from Google")
    }
    let state = searchParams.get("state")
    if (!state) {
        throw new ServerError("GoogleAuthError", "No signin state returned from Google")
    }
    let sid = JSON.parse(state).sid
    if (!sid) {
        throw new ServerError("GoogleAuthError", "No sid value returned from Google")
    }
    let secTokenFromGoogle = JSON.parse(state).sec_token
    if (!secTokenFromGoogle) {
        throw new ServerError("GoogleAuthError", "No sec token value returned from Google")
    }

    let redirect = JSON.parse(state).redirect  || "/"
    let prevURL = ctx.req.raw.headers.get("Referer")
    console.log(prevURL)

    // ------------------------------------------
    // Read the sec token & nonce from the db for the given session id
    // ------------------------------------------
    // TODO - destroy session if it is more than n minutes old. Likely a sign of abuse

    let sessionDetailsFromDB = await ctx.db.from('sessions')
    .select('sec_token, nonce, sectoken_set_at')
    .eq('id', sid)
    .limit(1)
    .maybeSingle()
    if (sessionDetailsFromDB.error) {
        throw new ServerError("GoogleAuthError", JSON.stringify(sessionDetailsFromDB.error))
    }
    if (!sessionDetailsFromDB.data?.sec_token || !sessionDetailsFromDB.data?.nonce) {
        throw new ServerError("GoogleAuthError", "No sec token or nonce found in the database")
    }

    // if the session is older than 5 minutes, throw an error
    const sessionSecSetAt = new Date(sessionDetailsFromDB.data.sectoken_set_at);
    const sessionExpiryTime = new Date(Date.now() - Settings.newSessionAge * 1000);

    if (sessionSecSetAt < sessionExpiryTime) {
        console.log(`created_at: ${sessionSecSetAt.toISOString()}, now: ${new Date().toISOString()}`);
        throw new ServerError("InvalidSession", "The session has expired");
    }

    let secTokenFromDB = sessionDetailsFromDB.data.sec_token as string
    let nonceFromDB = sessionDetailsFromDB.data.nonce as string

    // console.log("Cookies", secTokenCookie, nonceCookie)
    // ------------------------------------------
    // Verify the Security Token
    // ------------------------------------------
    if (secTokenFromDB != secTokenFromGoogle) {
        throw new ServerError("GoogleAuthError", "The security tokens do not match")
    }

    // ------------------------------------------
    // Get ID Token
    // ------------------------------------------
    let tokenReqBody = new URLSearchParams({
        code: code,
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
        let errorResponse = await tokenResponse.text(); 
        throw new ServerError("GoogleAuthError", 'Error in fetching id token: ' + errorResponse)
    } 

    let tokenData: any = await tokenResponse.json();
    
    let idToken = tokenData.id_token
    if (!idToken) {
        throw new ServerError("GoogleAuthError", 'No id token was returned from Google')
    }

    const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))
    const { payload } = await jwtVerify(idToken, JWKS, {
        issuer: 'https://accounts.google.com',
        audience: ctx.env.GOOGLE_CLIENT_ID
    })

    // ------------------------------------------
    // Validate Nonce
    // ------------------------------------------
    let nonceFromToken = payload.nonce
    if (!nonceFromToken) {
        throw new ServerError("GoogleAuthError", 'Nonce was not found in the Google payload')
    }
    if (nonceFromToken != nonceFromDB) {
        throw new ServerError("GoogleAuthError", 'The Nonce values do not match')
    }

    // ------------------------------------------
    // Get user details from DB. Else add to db
    // ------------------------------------------
    let user = {} as User
    let doesUserExistsInDb = await ctx.db.from('users')
        .select('*')
        .eq('google_id', payload.email)
        .limit(1)
        .maybeSingle()

    if (doesUserExistsInDb.error) {
        throw new ServerError("UnauthorizedAccess", JSON.stringify(doesUserExistsInDb.error))
    }
    console.log("doesUserExistsInDb", doesUserExistsInDb.data)

    let isNewUser = false
    if (doesUserExistsInDb.data == null) {
        // let uid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 64)()

        console.log(`user doesn't exist`)

        // Choose a random avatar
        let avatarNumber = Math.floor(Math.random() * (30 - 1 + 1)) + 1
        let avatarURL = `https://images.digglu.com/default_${avatarNumber < 10 ? "0": ""}${avatarNumber}.png`
         
        // create new user with default values
        user.slug           = getRandomSlug()
        user.name           = "Nony Mouse"
        user.thumb          = avatarURL;
        user.honorific      = "Mx"
        user.flair          = "Nony is not a Mouse"
        user.role           = "user"
        user.level          = "wood"
        user.stars          = 0
        user.creds          = 0
        user.gil            = 0
        user.google_id      = payload.email as string
        user.ext_id         = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)()

        const addUserToDB = await ctx.db.from('users').insert({
            flair       : user.flair, 
            google_id   : user.google_id, 
            honorific   : user.honorific, 
            level       : user.level, 
            name        : user.name, 
            role        : user.role, 
            slug        : user.slug, 
            thumb       : user.thumb,
            ext_id      : user.ext_id
        }).select()

        if (addUserToDB.error) {
            throw new ServerError("InternalServerError", JSON.stringify(addUserToDB.error))
        }
        console.log("Add User to DB", addUserToDB)
        user.id = addUserToDB.data[0].id

        // set the flag for new user
        isNewUser = true

    } else {
        console.log(`user exists`)
        user = doesUserExistsInDb.data as User
    }

    // ------------------------------------------
    // create session id. set session in db. set session cookie
    // ------------------------------------------
    // TODO add navigator data to session. 


    let userAgent = ctx.req.raw.headers.get('User-Agent') || ""
    const updateSession = await ctx.db.from('sessions')
    .update({ 
        user_id     : user.id, 
        user_agent  : userAgent,
        signedin_at : new Date().toISOString(),
    })
    .eq('id', sid)
    .select()

    if (updateSession.error) {
        console.error("Error in updating session", updateSession.error)
        throw new ServerError("InternalServerError", JSON.stringify(updateSession.error))
    }
    console.log (`session updated in db: ${JSON.stringify(updateSession.data)}`)

    ctx.res.headers.append('Set-Cookie', 
        `D_SID=${updateSession.data[0].id}; Max-Age=${Settings.maxSessionAge}; path=/; HttpOnly; Secure; SameSite=Strict;`);
    ctx.res.headers.append('Set-Cookie',
        `D_USER_INFO=${encodeURIComponent(JSON.stringify({
            is_signed_in    : true,
            slug            : user.slug,
            name            : user.name,
            thumb           : user.thumb,
            level           : user.level,
            stars           : user.stars,
            creds           : user.creds,
            gil             : user.gil,
            flair           : user.flair,
            ext_id          : user.ext_id,
        }))}; path=/; Secure; SameSite=Strict;`);

    // ------------------------------------------
    // Redirect to the original page
    // ------------------------------------------
    ctx.res.headers.append('Location', redirect)
    return new Response ('', {status: 302, headers: ctx.res.headers})
}