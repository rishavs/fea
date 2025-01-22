import { AppRoute, Context, ServerError } from "../../defs"

export const getUserFromSession = async (ctx: Context, route: AppRoute) => {

    // Check if the session cookie is present
    if (!ctx.req.cookies.D_SID) {
        throw new ServerError("InvalidSession", "The session info cookie is missing")
    }

    // Check if the session is valid
    let userDetailsFromSession = await ctx.db
        .from('sessions')
        .select('id, user_id, users(*)')
        .eq('id', ctx.req.cookies.D_SID)

    if (userDetailsFromSession.error) throw userDetailsFromSession.error

    if (!userDetailsFromSession.data[0].id) {
        throw new ServerError("InvalidSession", 'Session not found in db')
    } 

    console.log("User Details data: ", userDetailsFromSession.data)
    ctx.req.user = userDetailsFromSession.data[0].users as any

    console.log("Allowed User: ", ctx.req.user)

    // Check if the user is allowed to access the resource
    if (!ctx.req.user || !route.allow.includes(ctx.req.user.role)) {
        throw new ServerError("UnauthorizedAccess", "User with role:" + ctx.req.user?.role + " attempted to access a restricted resource")
    }
}