import { customAlphabet } from "nanoid";
import { NewPostSchema, PostCategories } from "../../../pub/sharedDefs";
import { Context, Post, ServerError, UserClientInfo } from "../../defs";
import { getRandomSlug } from "../slug";
import { getOGDataFromURL } from "../helpers/getOGDataFromURL";
import { connect } from "cloudflare:sockets";

export const addUserInfoToSession = async (ctx: Context): Promise<Response> => {
    // check for user already done, so no new code required
    // console.log("User: ", ctx.user);
    
    // ------------------------------------------
    // Parse incoming request & validate data
    // ------------------------------------------
    // Parse the JSON data from the request body
    const data = await ctx.req.raw.json() as UserClientInfo;

    // console.log('Received JSON data:', data);

    // Validate the data
    if (!data || typeof data !== 'object') {
        throw new ServerError("InvalidRequestData", "Invalid user info json received from browser");
    }

    // ------------------------------------------
    // Save user info to session in db
    // ------------------------------------------
    const resSaveUserInfoToDB = await ctx.db.from('sessions')
        .update({
            conn_downlink: data.navigator.connection.downlink || null,
            conn_effective_type: data.navigator.connection.effectiveType || null,
            conn_rtt: data.navigator.connection.rtt || null,
            conn_save_data: data.navigator.connection.saveData || null,
            
            window_width    : data.window.width         || null,
            window_height   : data.window.height        || null,
            window_pixel_ratio: data.window.pixel_ratio || null,
            window_orientation: data.window.orientation || null,

            nav_user_agent  : data.navigator.userAgent   || null,
            nav_brands      : data.navigator.userAgentData.brands ? data.navigator.userAgentData.brands.toString() : null,
            nav_is_mobile   : data.navigator.userAgentData.mobile || false,
            nav_platform    : data.navigator.platform     || null,
            nav_language    : data.navigator.language     || null,
            
            updated_at      : new Date(),
        })
        .eq('id', ctx.req.cookies['D_SID'])
        .select()

    if (resSaveUserInfoToDB.error) throw resSaveUserInfoToDB.error

    // ------------------------------------------
    // Respond with success
    // ------------------------------------------
    ctx.res.body = JSON.stringify({success: true});
    return new Response(ctx.res.body, {
        status: 200,
        headers: ctx.res.headers
    });

}