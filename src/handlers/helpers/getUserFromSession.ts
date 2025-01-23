import { AppRoute, Context, ServerError } from "../../defs"

// Get user details from the session
// check if user fits the role
// update context with user details
export const getUserFromSession = async (ctx: Context) => {

    // Check if the session cookies are present
    if (!ctx.req.cookies.D_IS_SIGNEDIN) {
        throw new ServerError("InvalidSession", "The isSignedIn flag cookie is missing")
    }
    if (!ctx.req.cookies.D_SID) {
        throw new ServerError("InvalidSession", "The session info cookie is missing")
    }

    // Anonymous user
    // Anonymous user accessing an anonymous route. No action needed
    if (ctx.req.cookies.D_IS_SIGNEDIN === 'false' && ctx.req.allow.includes("anonymous")) {
        return
    }

    // Signed in user
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
    if (!ctx.req.user || !ctx.req.allow.includes(ctx.req.user.role)) {
        throw new ServerError("UnauthorizedAccess", `User with id: ${ctx.req.user?.id} & role: ${ctx.req.user?.role} attempted to access a restricted resource`)
    }
}