import { customAlphabet } from "nanoid"
import { Context, ServerError } from "../../defs"

export const addSession = async (ctx: Context, userId?: string) => {

    if (userId) {
        
    } else {

        // ------------------------------------------
        // create session id. set session in db. set session cookie
        // ------------------------------------------
        let userAgent = ctx.req.raw.headers.get('User-Agent') || ""
        const addNewSession = await ctx.db.from('sessions').insert({
            id: customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)(),
            user_agent: ctx.req.raw.headers.get('User-Agent') || "",
        }).select()
            
        if (addNewSession.error) {
            throw new ServerError("GoogleAuthError", JSON.stringify(addNewSession.error))
        }
        console.log (`session created in db: ${JSON.stringify(addNewSession.data)}`)
        

    }

}