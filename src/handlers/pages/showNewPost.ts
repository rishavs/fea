import { NewPostSchema, PostCategories } from "../../../pub/sharedDefs";
import { Context, Page } from "../../defs";
import { buildPage } from "../../views/buildPage";

export const showNewPost = async (ctx: Context): Promise<Response> => {
    let page = {} as Page
    page.title = "New Post"
    page.error = null
    page.content = /*html*/`
    <article class="pt-8 lg:pt-20">
        
        <div class="card w-full bg-base-100 border border-base-300">
            <div class="card-body">
                <h2 class="card-title font-semibold">Add a new post</h2>
                
                <form id="new_post_form" name="new_post_form" method="post" action="/api/save-new-post" class="flex flex-col gap-2">
            
                    <div class="divider"></div> 
    
                    <div class="form-control w-full">                   
                        <div class="dropdown dropdown-bottom w-full">
                            <label class="label">
                                <span class="label-text">Select a Post Category</span>
                            </label>
                            <select id="post_category_select" class="select select-bordered w-full text-lg invalid:border-error" name="category" required>
                                <option class="text-2xl lg:text-lg" value="" selected disabled hidden>Select Post Category</option>
                                ${
                                    
                                    Object.keys(PostCategories).map((cat) => {
                                            const key = cat as keyof typeof PostCategories;
                                            
                                        return /*html*/ `
                                        <option class="" value="${key}">${PostCategories[key]}</option>
                                        
                                        `;
                                    }).join("")
                                }

                            </select>
                        </div>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text"></span>
                        </label>

                        <label class="label cursor-pointer">
                            <span class="label-text">Does this Post links to any web page?</span>
                            <input id="post_type" name="is_link" type="checkbox" class="toggle toggle-success" checked />
                        </label>
                      
                    </div>

                    <div id="post_link_controls" class="form-control w-full">
                        <label class="label">
                            <span class="label-text">Link to external article</span>
                            <span id="post_link_char_count" class="label-text-alt opacity-50">0/${NewPostSchema.linkMaxLength} chars</span>
                        </label>
                        <input id="post_link_input" type="url" name="link" placeholder="Please add a valid & live url here" class="input input-bordered w-full invalid:border-error" required minlength="${NewPostSchema.linkMinLength}" maxlength="${NewPostSchema.linkMaxLength}"/>
                        <label class="label">
                            <span class="label-text-alt opacity-50">Must be a URL</span>
                        </label>
                    </div>

                    <div id="post_title_controls" class="form-control w-full">
                        <label class="label">
                            <span class="label-text">Post Title</span>
                            <span id="post_title_char_count" class="label-text-alt opacity-50">0/${NewPostSchema.titleMaxLength} chars</span>
                        </label>
                        <input id="post_title_input" type="text" placeholder="Please add a title for your post" name="title"
                            class="input input-bordered w-full invalid:border-error" required minlength="${NewPostSchema.titleMinLength}" maxlength="${NewPostSchema.titleMaxLength}" />
                        <label class="label">
                            <span class="label-text-alt opacity-50">Min 16 chars</span>
                        </label>
                    </div>

                    <div id="post_content_controls" class="form-control">
                        <label class="label">
                            <span class="label-text">Post Content</span>
                            <span id="content_char_count" class="label-text-alt">0/${NewPostSchema.contentMaxLength} chars</span>
                        </label>
                        <textarea id="post_content_textarea" minlength="${NewPostSchema.contentMinLength}" maxlength="${NewPostSchema.contentMaxLength}" name="content"
                            class="textarea textarea-bordered h-24 invalid:border-error" placeholder="Please add a comment on your submission." required></textarea>
                        <label class="label">
                            <span class="label-text-alt opacity-50">Min ${NewPostSchema.contentMinLength} chars. Use Markdown for formatting.</span>
                        </label>
                    </div>

                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <span class="label-text">Post A-Nony-Mousely?</span>
                            <input id="post_as_nony" name="is_nony" type="checkbox" class="toggle"/>
                        </label>
                        
                        <label class="label">
                            <span class="label-alt-text opacity-50">Note: When a post is made anonymously, people cannot see who authored it. But of course, internally the post would still be linked to the author. So, ensure that you are following the Community Guidelines </span>
                        </label>
                    </div>
                    
                    <div class="divider"></div> 

                    <div class="card-actions justify-end">
                        <button type="submit" class="btn btn-error">Submit</button>
                    </div>
                </form>


            </div>
        </div>
                
    </article>
    `
    return new Response(buildPage(ctx, page), { headers: ctx.res.headers });
}