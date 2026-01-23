import { NewPostSchema, PostCategoriesRec } from '../../defs';
import { Context, Page } from '../../defs';
import { buildPage } from '../../views/buildPage';

export const showNewPost = async (ctx: Context): Promise<Response> => {
	let page = {} as Page;
	page.title = 'New Post';
	page.content = /*html*/ `
<article class="pt-8 lg:pt-20 w-full">

    <div class="card lg:card-lg w-full shadow border border-base-300">
        <div class="card-body">
            <h2 class="card-title">Add a new post</h2>

            <form id="new_post_form" name="new_post_form" method="post" action="/api/save-new-post" class="flex flex-col gap-2">

                <fieldset class="fieldset">
                    <label class="flex justify-between">
                        <legend class="fieldset-legend">Select a Post Category</legend>
                    </label>

                    <label class="cursor-pointer flex justify-between">
                        <span class="">Does this Post links to any web page?</span>
                        <input id="post_type" name="is_link" type="checkbox" class="toggle toggle-success" checked />
                    </label>
                
                </fieldset>
                
                <fieldset class="fieldset" id="post_link_controls">
                    <label class="flex justify-between">
                        <legend class="fieldset-legend">Link to external article</legend>
                        <span id="post_link_char_count" class="fieldset-label">0/${NewPostSchema.linkMaxLength} chars</span>
                    </label>

                    <input id="post_link_input" type="url" name="link" placeholder="Please add a valid & live url here" class="input input-bordered w-full invalid:border-error valid:border-success" required minlength="${NewPostSchema.linkMinLength}" maxlength="${NewPostSchema.linkMaxLength}"/>

                    <label class="flex justify-between">
                        <span class="fieldset-label">Must be a URL like "https://digglu.com"</span>
                        <span class="fieldset-label"></span>
                    </label>
                </fieldset>
                
                <fieldset class="fieldset">
                    <label class="flex justify-between">
                        <legend class="fieldset-legend">Select a Post Category</legend>
                    </label>

                    <select id="post_category_select" class="select select-bordered w-full invalid:border-error" name="category" required>
                        <option class="text-2xl lg:text-lg" value="" selected disabled hidden>Select Post Category</option>
                        ${Object.keys(PostCategoriesRec).map((cat) => {
                            const key = cat as keyof typeof PostCategoriesRec;
                            return /*html*/ `<option class="" value="${key}">${PostCategoriesRec[key]}</option>`;
                            }).join("")
                        }
                    </select>
                    
                </fieldset>
                
                <fieldset class="fieldset">
                    <label class="flex justify-between">
                        <legend class="fieldset-legend">Post title</legend>
                        <span id="post_title_char_count" class="fieldset-label">0/${NewPostSchema.titleMaxLength} chars</span>
                    </label>

                    <input id="post_title_input" type="text" placeholder="Please add a title for your post" name="title"
                        class="input input-bordered w-full invalid:border-error valid:border-success" required minlength="${NewPostSchema.titleMinLength}" maxlength="${NewPostSchema.titleMaxLength}" />

                    <label class="flex justify-between">
                        <span class="fieldset-label">Min ${NewPostSchema.titleMinLength} chars</span>
                        <span class="fieldset-label"></span>
                    </label>
                </fieldset>
                
                <fieldset class="fieldset">
                    <label class="flex justify-between">
                        <legend class="fieldset-legend">Post content</legend>
                        <span id="content_char_count" class="fieldset-label">0/${NewPostSchema.contentMaxLength} chars</span>
                    </label>

                    <textarea id="post_content_textarea" minlength="${NewPostSchema.contentMinLength}" maxlength="${NewPostSchema.contentMaxLength}" name="content"
                        class="textarea textarea-bordered w-full invalid:border-error valid:border-success" placeholder="Please add a comment on your submission." required ></textarea>
                    
                    <label class="flex justify-between">
                        <span class="fieldset-label">Min ${NewPostSchema.contentMinLength} chars. Use Markdown for formatting.</span>
                        <span class="fieldset-label"></span>
                    </label>
                </fieldset>

                <fieldset class="fieldset">
                    <label class="flex justify-between">
                        <legend class="fieldset-legend">Post A-Nony-Mousely?</legend>
                    </label>

                    <label class="cursor-pointer flex justify-between">
                        <span class="">Does this Post links to any web page?</span>
                        <input id="post_as_nony" name="is_nony" type="checkbox" class="toggle"/>
                    </label>
                    
                    <label class="flex justify-between">
                        <span class="fieldset-label">Note: When a post is made anonymously, people cannot see who authored it. Bt of course, internally the post would still be linked to the author. So, ensure that you are following the Community Guidelines</span>
                        <span class="fieldset-label"></span>
                    </label>
                </fieldset>

                <div class="card-actions justify-end">
                    <button class="btn btn-primary">Submit</button>
                </div>
            </form>


        </div>
    </div>

</article>
<script type="text/javascript">
post_type.addEventListener("click", (e) => {
    if (post_type.checked) {
        post_link_controls.classList.remove("hidden")
        post_link_input.required = true
    } else {
        post_link_controls.classList.add("hidden")
        post_link_input.required = false
    }
})
post_link_input.addEventListener("input", async(e) => {
    let numOfEnteredChars = post_link_input.value.length;
    post_link_char_count.innerText = numOfEnteredChars + "/" + ${NewPostSchema.linkMaxLength} + " chars";
})
post_title_input.addEventListener("input", async(e) => {
    let numOfEnteredChars = post_title_input.value.length;
    post_title_char_count.innerText = numOfEnteredChars + "/" + ${NewPostSchema.titleMaxLength} + " chars";
})
post_content_textarea.addEventListener("input", async(e) => {
    let numOfEnteredChars = post_content_textarea.value.length;
    content_char_count.innerText = numOfEnteredChars + "/" + ${NewPostSchema.contentMaxLength} + " chars";
})
</script>
`;

	return new Response(buildPage(ctx, page), {
		status: 200,
		headers: ctx.res.headers,
	});
};
