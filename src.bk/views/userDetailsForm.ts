import { UserControlsSchema, UserPronouns } from '../../pub/sharedDefs';

export const userDetailsForm = () => {
	return /*html*/ `

<p class="my-4">Feel free to update your details now, or later in the Profiles page.</p>

<form id="user_details_form" class="w-full flex flex-col gap-4">

<fieldset class="fieldset w-full gap-3">
  <label class="flex justify-between" for="user_name_input">
    <legend class="text-base">Your display name</legend>
    <span id="user_name_input_char_count" class="label">0/${
			UserControlsSchema.nameMaxLength
		} chars</span>
  </label>
  <input id="user_name_input" name="name" type="text" class="input input-bordered w-full" value="" required title="Only letters, numbers, and single spaces allowed" minLength="${
		UserControlsSchema.nameMinLength
	}" maxLength="${UserControlsSchema.nameMaxLength}" />

  <label class="flex justify-end" for="user_name_input">
    <span class="label">Only letters, numbers, and single spaces</span>
  </label>
</fieldset>

<fieldset class="fieldset w-full gap-3">
<label class="floating-label">
<span>Your name</span>
<input type="text" placeholder="Your name" class="input input-md" />
</label>
</fieldset>

<fieldset class="fieldset gap-3">
  <label class="" for="user_thumb_input">
    <legend class="text-base">Your profile pic and your pronouns</legend>
  </label>
  <div class="flex gap-4">
    <input id="user_thumb_input" name="thumb" type="file" class="file-input-bordered file-input w-26" accept="image/jpeg,image/png" />
    <select id="user_pronouns_select" name="pronouns" class="btn grow border border-base-300">
    ${Object.values(UserPronouns)
      .map((item, i) => {
        return `<option class="text-xl">${item}</option>`;
      })
      .join('')}
    </select>
  </div>
  <label class="" for="user_thumb_input">
    <span class="label">1MB max image size</span>
  </label>
</fieldset>


    <button class="btn btn-primary self-end min-w-32 mt-4">Save</button>
</form>
`;
};
