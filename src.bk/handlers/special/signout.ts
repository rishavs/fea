import { Context, ServerError } from "../../defs"

export const signout = async (ctx: Context): Promise<Response> => {

    if (!ctx.req.cookies.D_SID) {
        console.error(new ServerError("InvalidSession", "Signout silently failed as session cookie is missing"))
        return Response.redirect('/', 302)
    }

    let resCloseSession = await ctx.db.from('sessions')
        .delete()
        .eq('id', ctx.req.cookies.D_SID)
        .select()
    if (resCloseSession.error) {console.error(resCloseSession.error)}
    
    // console.log(`session ${resCloseSession.data[0].id} closed in db`)

    // delete all cookies
    ctx.res.headers.append('Set-Cookie', 
        `D_SID=; path=/; HttpOnly; Secure; Max-Age=0;`);
    ctx.res.headers.append('Set-Cookie', 
        `D_USER_INFO=; path=/; Secure; Max-Age=0;`);

    ctx.res.headers.append('Location', '/')
    return new Response ('', {status: 303, headers: ctx.res.headers})
}

