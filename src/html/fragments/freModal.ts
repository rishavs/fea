import { UserPronoun, UserSchema } from '../../models/users';

export const freModal = () => {
	return /*html*/ `
<dialog id="fre_modal" open class="modal modal-bottom lg:modal-middle">
    <div class="modal-box">

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
    
        <h3 class="text-lg font-bold text-center py-4">🎉🔥 Welcome to Digglu! 🎊 🥳</h3>
        <p class="text-center prose prose-sm lg:prose-base">
            Hey there! Its great to have you join our little community.
        </p>
        <p class="text-center prose prose-sm lg:prose-base">
            I am <b>Mockingbird</b>, the admin/janitor here. 
        </p>
        <p class="text-center prose prose-sm lg:prose-base">
            For your privacy, I have set up your profile with some random details. 
        </p>
        <p class="text-center prose prose-sm lg:prose-base">
            Feel free to update your profile here, or anytime later in the Profiles page.
        </p>

        <form id="user_details_form" class="w-full flex flex-col gap-2">
            <fieldset class="fieldset">
                <label class="flex justify-between">
                    <legend class="fieldset-legend">Your display name</legend>
                    <span class="label">
                        <span id="user_name_input_char_count" class="">0</span>
                        <span>/ ${UserSchema.nameMaxLength} chars</span>
                    </span>
                </label>
                <input id="user_name_input" name="name" type="text" class="input input-bordered w-full invalid:border-error valid:border-success" required minLength="${
									UserSchema.nameMinLength
								}" maxLength="${UserSchema.nameMaxLength}" />
                
            </fieldset>

            <fieldset class="fieldset">
                <label class="flex justify-between">
                    <legend class="fieldset-legend">Your profile pic</legend>
                    <span class="fieldset-label">1MB max image size</span>
                </label>

                <input id="user_thumb_input" name="thumb" type="file" class="file-input file-input-bordered w-full invalid:border-error valid:border-success" accept=${UserSchema.thumbFileTypes.join(
									',',
								)} />

            </fieldset>

            <fieldset class="fieldset">
                <label class="flex justify-between">
                    <legend class="fieldset-legend">And your pronouns</legend>
                    <span class="fieldset-label">Select a preferred pronoun</span>
                </label>
                
                <select id="user_pronouns_select" name="pronouns" class="select select-bordered w-full invalid:border-error valid:border-success">

                    ${Object.values(UserPronoun)
											.map((item, i) => {
												return `<option class=" text-xl">${item}</option>`;
											})
											.join('')}
                </select>
            </fieldset>

            <button class="btn btn-primary self-end min-w-32 mt-4">Save</button>
        </form>
  
    </div>
</dialog>
`;
};
