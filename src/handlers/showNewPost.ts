import { ServerContext } from '../../models/context';
import { newPostSchema, postCategories } from '../../models/posts';
import { HTMLResponse } from '../../models/responses';
import { buildSummaryCards } from '../html/fragments/summaryCard';

export const showNewPost = async (ctx: ServerContext): Promise<Response> => {
	let res = new HTMLResponse();
	res.status = 200;
	res.title = 'Home Page';
	res.description = 'Welcome to the home page!';
	res.cards = [buildSummaryCards()];
	res.page = /*html*/ `
<article class="pt-8 lg:pt-20 w-full">

    <div class="card lg:card-lg w-full shadow border bg-base-100 border-base-300">
        <div class="card-body">
            <h2 class="card-title">Add a new post</h2>

            <form id="new_post_form" name="new_post_form" method="post" action="/api/save-new-post" class="flex flex-col gap-2">

                <fieldset class="fieldset">
                    <label class="flex justify-between">
                        <legend class="fieldset-legend">Does this Post links to any web page?</legend>
                    </label>

                    <label class="cursor-pointer flex justify-between">
                        <span class="">Toggle to add a link to this external web page</span>
                        <input id="post_type" name="is_link" type="checkbox" class="toggle toggle-success" checked />
                    </label>
                
                </fieldset>
                
                <fieldset class="fieldset" id="post_link_controls">
                    <label class="flex justify-between">
                        <legend class="fieldset-legend">Link to external page</legend>
                        <span id="post_link_char_count" class="fieldset-label">0/${newPostSchema.linkMaxLength} chars</span>
                    </label>

                    <input id="post_link_input" type="url" name="link" placeholder="Please add a valid & live url here" class="input input-bordered w-full invalid:border-error valid:border-success" required minlength="${newPostSchema.linkMinLength}" maxlength="${newPostSchema.linkMaxLength}"/>

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
                        ${Object.keys(postCategories)
													.map((cat) => {
														const key = cat as keyof typeof postCategories;
														return /*html*/ `<option class="" value="${key}">${postCategories[key]}</option>`;
													})
													.join('')}
                    </select>
                    
                </fieldset>
                
                <fieldset class="fieldset">
                    <label class="flex justify-between">
                        <legend class="fieldset-legend">Post title</legend>
                        <span id="post_title_char_count" class="fieldset-label">0/${newPostSchema.titleMaxLength} chars</span>
                    </label>

                    <input id="post_title_input" type="text" placeholder="Please add a title for your post" name="title"
                        class="input input-bordered w-full invalid:border-error valid:border-success" required minlength="${newPostSchema.titleMinLength}" maxlength="${newPostSchema.titleMaxLength}" />
                    <label class="flex justify-between">
                        <span class="fieldset-label">Min ${newPostSchema.titleMinLength} chars</span>
                        <span class="fieldset-label"></span>
                    </label>
                </fieldset>
                
                <fieldset class="fieldset">
                    <label class="flex justify-between">
                        <legend class="fieldset-legend">Post content</legend>
                        <span id="content_char_count" class="fieldset-label">0/${newPostSchema.contentMaxLength} chars</span>
                    </label>

                    <textarea id="post_content_textarea" minlength="${newPostSchema.contentMinLength}" maxlength="${newPostSchema.contentMaxLength}" name="content"
                        class="textarea textarea-bordered w-full invalid:border-error valid:border-success" placeholder="Please add a comment on your submission." required ></textarea>
                    
                    <label class="flex justify-between">
                        <span class="fieldset-label">Min ${newPostSchema.contentMinLength} chars. Use Markdown for formatting.</span>
                        <span class="fieldset-label"></span>
                    </label>
                </fieldset>

                <fieldset class="fieldset">
                    <label class="flex justify-between">
                        <legend class="fieldset-legend">Post A-Nony-Mousely?</legend>
                    </label>

                    <label class="cursor-pointer flex justify-between">
                        <span class="">Toggle to post this anonymously, so that others cannot see the author's name</span>
                        <input id="post_as_nony" name="is_nony" type="checkbox" class="toggle toggle-success"/>
                    </label>
                    
                    <label class="flex justify-between">
                        <span class="fieldset-label">Warning: While other users cannot see the author's name, internally the post would still be linked to you. So, please do not post anything illegal and follow the Community Guidelines!!</span>
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
`;

	return res.build();
};
