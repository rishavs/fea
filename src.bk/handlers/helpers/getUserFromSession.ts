import { AppRoute, Context, ServerError, User } from "../../defs"

export const getUserFromSession = async (ctx: Context) => {
    // no-op if user is already set
    console.log("Checking for user in session: ", ctx.req.user)
    if (ctx.req.user) return

    // Check if the session is valid
    let userDetailsFromSession = await ctx.db
        .from('sessions')
        .select('users(*)')
        .eq('id', ctx.req.cookies.D_SID)
        .limit(1)
        .maybeSingle()

    if (userDetailsFromSession.error) throw userDetailsFromSession.error
    
    ctx.req.isSignedIn  = userDetailsFromSession.data ? true : false
    ctx.req.user        = userDetailsFromSession.data
        ? userDetailsFromSession.data.users as any
        : null
    console.log("Allowed User: ", ctx.req.user)

}
