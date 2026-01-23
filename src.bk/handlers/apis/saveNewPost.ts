import { customAlphabet } from "nanoid";
import { NewPostSchema, PostCategories } from "../../../pub/sharedDefs";
import { Context, Post, ServerError } from "../../defs";
import { getRandomSlug } from "../slug";
import { getOGDataFromURL } from "../helpers/getOGDataFromURL";

export const saveNewPost = async (ctx: Context): Promise<Response> => {
    
    // ------------------------------------------
    // Parse incoming request & validate data
    // ------------------------------------------
    const formData = await ctx.req.raw.formData();
    console.log("Form Data: ", formData);
    console.log("Form Data as Object: ", Object.fromEntries(formData.entries()));

    let post = {} as Post
    post.category   = formData.get('category') as string
    post.title      = formData.get('title') as string
    post.content    = formData.get('content') as string
    post.type       = formData.get('is_link') ? 'link' : 'text'
    post.link       = formData.get('content') as string
    post.isAnonymous= formData.get('is_nony') ? true : false

    console.log("POST: ", post)

    const postCat       = formData.get('category') as (typeof PostCategories)[keyof typeof PostCategories]
    const postTitle     = formData.get('title') as string
    const postContent   = formData.get('content') as string
    const postIsLink    = formData.get('is_link') as 'on' | null
    const postLink      = formData.get('link') as string
    const postIsNony    = formData.get('is_nony') as 'on' | null

    const postExtId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)()

     // Validate form data
     if (!postTitle || postTitle.length < NewPostSchema.titleMinLength || postTitle.length > NewPostSchema.titleMaxLength) {
        throw new ServerError("InvalidRequestData", "Invalid post title");
    }

    if (!postContent || postContent.length < NewPostSchema.contentMinLength || postContent.length > NewPostSchema.contentMaxLength) {
        throw new ServerError("InvalidRequestData", "Invalid post content");
    }

    if (postIsLink) {
        let _ = new URL(postLink)
        if (!postLink || postLink.length < NewPostSchema.linkMinLength || postLink.length > NewPostSchema.linkMaxLength) {
            throw new ServerError("InvalidRequestData", "Invalid post link");
        }
    }

    // Generate slug
    // let postSlug = getRandomSlug()
    let postSlug = 'chonk-masta'

    // Check if the slug is unique
    let resCheckSlugUnique = await ctx.db.from('posts')
        .select('*', { count: 'exact', head: true })
        .like('slug', postSlug + "%")
    
    if (resCheckSlugUnique.error) throw resCheckSlugUnique.error

    // If not unique, add a number to the slug
    postSlug = resCheckSlugUnique.count! > 0 ? postSlug + '-' + (resCheckSlugUnique.count! + 1) : postSlug

    // ------------------------------------------
    // Fetch Open Graph data for the link
    // ------------------------------------------
    const ogData 	= await getOGDataFromURL(new URL(postLink) );
    console.log("OG Data: ", ogData);
    
    // ------------------------------------------
    // Upload images
    // ------------------------------------------
    let postThumbURL = null
    let postFullImageURL = null
    if (ogData.image || ogData.bodyImage) {
        // Download image & icon
        let imgURL = ogData.image ? ogData.image : ogData.bodyImage
        let imgResp = await fetch(imgURL!)
        let imgFile: File = new File([await imgResp.blob()], 'image.jpg', { type: 'image/jpeg' });

        console.log("Image File: ", imgFile)

        // Upload thumbnail & full image to CDN
        const ResUploadThumb = await ctx.db.storage
            .from('post-thumbs')
            .upload(postExtId, imgFile, {
                cacheControl: '3600',
                upsert: false
            })
        if (ResUploadThumb.error) throw ResUploadThumb.error
        console.log("Thumb uploaded to storage: ", ResUploadThumb.data)

        // Get the thumb URL
        postThumbURL = await ctx.db.storage
            .from('post-thumbs')
            .getPublicUrl(postExtId)

        console.log("Thumb URL: ", postThumbURL.data.publicUrl)

        // Upload full image to CDN
        const ResUploadFullImage = await ctx.db.storage
            .from('post-full')
            .upload(postExtId, imgFile, {
                cacheControl: '3600',
                upsert: false
            })
        if (ResUploadFullImage.error) throw ResUploadFullImage.error

        console.log("Full Image uploaded to storage: ", ResUploadFullImage.data)

        // Get the full image URL
        postFullImageURL = await ctx.db.storage
            .from('post-full')
            .getPublicUrl(postExtId)

        console.log("Full Image URL: ", postFullImageURL.data.publicUrl)

    }

    // Upload favicon to CDN
    let postIconURL = null
    if (ogData.icon) {
        let iconURL = ogData.icon
        let iconResp = await fetch(iconURL)
        let iconFile: File = new File([await iconResp.blob()], 'icon.jpg', { type: 'image/jpeg' });

        console.log("Icon File: ", iconFile)

        const ResUploadIcon = await ctx.db.storage
            .from('post-icons')
            .upload(postExtId, iconFile, {
                cacheControl: '3600',
                upsert: false
            })
        if (ResUploadIcon.error) throw ResUploadIcon.error
        console.log("Icon uploaded to storage: ", ResUploadIcon.data)

        // Get the icon URL
        postIconURL = await ctx.db.storage
            .from('post-icons')
            .getPublicUrl(postExtId)

        console.log("Icon URL: ", postIconURL.data.publicUrl)

    }
    
    // ------------------------------------------
    // Save post to db
    // ------------------------------------------
    const resSavePostToDB = await ctx.db.from('posts')
        .insert({ 
            title           : postTitle,
            content         : postContent,
            category        : postCat,
            slug            : postSlug,
            link            : postLink,
            type            : postIsLink ? 'link' : 'text',
            user_id         : ctx.req.user!.id,
            ext_id          : postExtId,
            is_anonymous    : postIsNony ? true : false,
            thumb           : postThumbURL ? postThumbURL.data.publicUrl : null,

            og_title        : ogData.title,
            og_description  : ogData.desc,
            og_url          : ogData.url,
            og_image        : postFullImageURL ? postFullImageURL.data.publicUrl : null,
            og_image_alt    : ogData.imageAlt,
            og_icon         : postIconURL ? postIconURL.data.publicUrl : null
        }).select()
            
    if (resSavePostToDB.error) throw resSavePostToDB.error

    // ------------------------------------------
    // Redirect to new post
    // ------------------------------------------
    let newPostURL = ctx.req.url.origin + '/' + postCat + '/' + postSlug
    return Response.redirect(newPostURL, 303)

}