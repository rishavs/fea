import { customAlphabet } from "nanoid";
import { Context, ServerError, UserPronoun, UserPronounsList, UserSchema } from "../../defs";

export const updateUserDetails = async (ctx: Context): Promise<Response> => {

    // Parse the incoming request as FormData
    const formData = await ctx.req.raw.formData();
    console.log("Form Data: ", formData);

    // const freUser = Object.fromEntries(formData.entries()) as UserFREDetails
 
    const name = formData.get('name') as string
    const thumb = formData.get('thumb') as File
    const pronouns = formData.get('pronouns') as UserPronoun

    // If data has not changed, return early
    if ( name === ctx.req.user!.name 
        && thumb === null
        && pronouns === ctx.req.user!.pronouns
    ) {
        console.log("No changes detected, returning early")
        return Response.redirect(ctx.req.raw.headers.get('Referer') || '/', 303);
    }

    // Validate form data
    // Required fields: name, slug, pronouns
    if (name.length >= UserSchema.nameMinLength
        && name.length <= UserSchema.nameMaxLength
        // && namePattern.test(name)  
    ) {
        ctx.req.user!.name = name;
    } else {
        throw new ServerError("InvalidRequestData", "User name doesn't meets the schema requirements");
    }

    // Validate pronouns
    if ((UserPronounsList).includes(pronouns)) {
        ctx.req.user!.pronouns = pronouns as UserPronoun
    } else {
        throw new ServerError("InvalidRequestData", "User pronouns doesn't meets the schema requirements");
    }

    // Optional fields: thumb
    if (thumb) {
        console.log("Uploading Thumb file to R2: ", thumb);
        if (thumb.size > UserSchema.thumbMinSize
            && thumb.size < UserSchema.thumbMaxSize
            && UserSchema.thumbFileTypes.includes(thumb.type)
        ) {
            let fileId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 32)() 
                + "__" + encodeURIComponent(thumb.name)
                
            let imgUpload = await ctx.env.STORAGE.put(fileId, thumb, {
                httpMetadata: { "contentType": thumb.type}
            })
            if(!imgUpload) throw new ServerError("ServiceUnavailable", "Failed to upload thumb file to R2")
            console.log("R2 object:", imgUpload)

            let thumbURL = `https://images.digglu.com/${fileId}`
            ctx.req.user!.thumb = thumbURL;
        } else {
            throw new ServerError("InvalidRequestData", "User thumb doesn't meets the schema requirements");
        }
    }

    // // Update the user details in the database
    let resUpdateDetails = await ctx.db.from('users')
        .update({
            name: ctx.req.user!.name,
            pronouns: pronouns
        })
        .eq('id', ctx.req.user!.id)

    if (resUpdateDetails.error) throw resUpdateDetails.error

    // Update the user thumb
    let resUpdateThumb = await ctx.db.from('users')
        .update({
            thumb: ctx.req.user!.thumb
        })
        .eq('id', ctx.req.user!.id)

    if (resUpdateThumb.error) throw resUpdateThumb.error

    console.log("User details updated in the database for user: ", ctx.req.user!.id);

    // make the client update the stored user details
    ctx.res.headers.append('Set-Cookie', `D_SYNC_USER=${encodeURIComponent(JSON.stringify(ctx.req.user))}; path=/; SameSite=Strict;`) 
    return new Response("", { headers: ctx.res.headers, status: 201 });
}