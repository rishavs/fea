import { Context, ServerError } from "../../defs"
import { parseCookies } from "../../utils"

export const signout = async (ctx: Context): Promise<Response> => {

    let cookies = parseCookies(ctx.req.raw.headers.get('Cookie') || "")
    
    if (!cookies.D_SID) {
        console.error(new ServerError("InvalidSession", "The session cookie wasn't found"))
        return Response.redirect('/', 302)
    }

    let resCloseSession = await ctx.db.from('sessions')
        .delete()
        .eq('id', cookies.D_SID)
        .select()

    if (resCloseSession.error) {console.error(resCloseSession.error)}
    
    // console.log(`session ${resCloseSession.data[0].id} closed in db`)

    // delete all cookies
    ctx.res.headers.append('Set-Cookie', `D_SID=; path=/; HttpOnly; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`);
    
    // return new Response ('', {headers: ctx.res.headers})
    let prevURL = ctx.req.raw.headers.get("Referer")
    console.log(prevURL)

    ctx.res.headers.append('Location', prevURL || '/')
    return new Response ('', {status: 302, headers: ctx.res.headers})
}

