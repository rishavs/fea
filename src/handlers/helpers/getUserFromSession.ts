import { AppRoute, Context, ServerError } from "../../defs"

export const getUserFromSession = async (ctx: Context, route: AppRoute) => {

    // Check if the session cookie is present
    if (!ctx.req.cookies.D_SID) {
        throw new ServerError(400, "Unable to signin. Please try again later", 'The session info cookie is missing')
    }

    // Check if the session is valid
    let userDetailsFromSession = await ctx.db
        .from('sessions')
        .select('id, users(*)')
        .eq('id', ctx.req.cookies.D_SID)

    if (userDetailsFromSession.error) throw userDetailsFromSession.error

    if (!userDetailsFromSession.data[0].id) {
        throw new ServerError(403, "Invalid session. Please delete all cookies and try again.", 'Session not found in db')
    } 
    ctx.req.user = userDetailsFromSession.data[0].users as any
    console.log("Allowed User: ", ctx.req.user)

    // Check if the user is allowed to access the resource
    if (!ctx.req.user || !route.allow.includes(ctx.req.user.role)) {
        throw new ServerError(403, "Access to this resource is not allowed", "User with role:" + ctx.req.user?.role + " attempted to access a restricted resource")
    }
}