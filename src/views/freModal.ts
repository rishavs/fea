import {
    UserControlsSchema,
    UserPronouns
} from '../../pub/sharedDefs';

export const freModal = () => {
    return /*html*/ `
<!-- Open the modal using ID.showModal() method -->
<dialog open id="fre_modal" class="modal modal-bottom lg:modal-middle border border-base-300">
    <div class="modal-box flex flex-col">
        <h3 class="font-bold text-lg text-center mt-16">Welcome to Digglu!</h3>
        <p class="my-4">Let's get you setup. You can update your profile here, or anytime later in the Profiles page.</p>

        <form method="dialog">
            <button class="btn btn-square absolute right-6 top-6">✕</button>
        </form>

        <form id="user_details_form" class="w-full flex flex-col gap-2">
            <fieldset class="fieldset">
                <label class="flex justify-between">
                    <legend class="fieldset-legend">Your display name</legend>
                    <span id="user_name_input_char_count" class="label">0/${
                        UserControlsSchema.nameMaxLength
                        } chars</span>
                </label>
                <input id="user_name_input" name="name" type="text" class="input input-bordered w-full" required minLength="${
                        UserControlsSchema.nameMinLength
                    }" maxLength="${UserControlsSchema.nameMaxLength}" />
                <label class="flex justify-between">
                    <span class="fieldset-label">Only letters, numbers, and single spaces</span>
                    <span class="fieldset-label"></span>
                </label>
            </fieldset>

            <fieldset class="fieldset">
                <label class="flex justify-between">
                    <legend class="fieldset-legend">Your profile pic</legend>
                    <legend class="fieldset-legend">And your pronouns</legend>
                </label>
                <div class="flex gap-4">
                    <div class="w-1/2">
                        <label for="user_thumb_input" class="btn border border-base-300 w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="size-6" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                <path d="M448 80c8.8 0 16 7.2 16 16l0 319.8-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3L48 96c0-8.8 7.2-16 16-16l384 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                            </svg>
                            <span>Select image</span>
                        </label>
                        <input id="user_thumb_input" name="thumb" class="hidden" type="file" accept="image/jpeg,image/png" />
                    </div>

                    <select id="user_pronouns_select" name="pronouns" class="select select-bordered w-1/2">

                        ${
                        Object.values(UserPronouns)
                        .map((item, i) => {
                        return `<option class=" text-xl">${item}</option>`;
                        })
                        .join('')}
                    </select>

                </div>
                <label class="flex justify-between">
                    <span class="fieldset-label">1MB max image size</span>
                    <span class="fieldset-label">Select a preferred pronoun</span>
                </label>
            </fieldset>

            <button class="btn btn-primary self-end min-w-32 mt-4">Save</button>
        </form>
    </div>
</dialog>
`
}