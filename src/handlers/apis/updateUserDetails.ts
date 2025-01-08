import { customAlphabet } from "nanoid";
import { Context, ServerError } from "../../defs";
import { UserControlsSchema, UserPronouns } from "../../../pub/sharedDefs";

export const updateUserDetails = async (ctx: Context): Promise<Response> => {

    // Parse the incoming request as FormData
    const formData = await ctx.req.raw.formData();
    console.log("Form Data: ", formData);
 
    const name = formData.get('name') as string
    const thumb = formData.get('thumb') as File
    const pronouns = formData.get('pronouns') as string

    // If data has not changed, return early
    if ( name === ctx.req.user!.name 
        && thumb === null
        && pronouns === ctx.req.user!.pronouns
    ) {
        console.log("No changes detected, returning early")
        return Response.redirect(ctx.req.raw.headers.get('Referer') || '/', 303);
    }

    // return new Response("OK", { headers: ctx.res.headers });

    // Validate form data
    // Required fields: name, slug, pronouns
    if (name.length >= UserControlsSchema.nameMinLength
        && name.length <= UserControlsSchema.nameMaxLength
        // && namePattern.test(name)  
    ) {
        ctx.req.user!.name = name;
    } else {
        throw new ServerError(400,'', "User name doesn't meets the schema requirements");
    }

    // Validate pronouns
    if (Object.values(UserPronouns).includes(pronouns)) {
        ctx.req.user!.pronouns = pronouns;
    } else {
        throw new ServerError(400, '', "User pronouns doesn't meets the schema requirements");
    }

  
    // // Optional fields: thumb
    if (thumb) {
        if (thumb.size > UserControlsSchema.thumbMinSize
            && thumb.size < UserControlsSchema.thumbMaxSize
            && UserControlsSchema.thumbFileTypes.includes(thumb.type)
        ) {
            let fileId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)()

            const ResUploadThumb = await ctx.db.storage
                .from('avatars')
                .upload(fileId, thumb, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (ResUploadThumb.error) throw ResUploadThumb.error
            
            console.log("Thumb uploaded to storage: ", ResUploadThumb.data)
            // Get the thumb URL
            const CFRespData = await ctx.db.storage
                .from('avatars')
                .getPublicUrl(fileId)

            console.log("Thumb URL: ", CFRespData.data.publicUrl)

            // now we need to choose the variant ending in userthumb and save it in db
            // and update the user object with the new image url
            // let imgUrl = CFRespData.result.variants.find( (v: string) => v.endsWith('userthumb'));
            ctx.req.user!.thumb = CFRespData.data.publicUrl;
        } else {
            throw new ServerError(400, '', "User thumb doesn't meets the schema requirements");
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