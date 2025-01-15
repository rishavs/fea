import { UserControlsSchema, UserPronouns } from '../../pub/sharedDefs';

export const userDetailsForm = () => {
	return /*html*/ `

<div class="divider">Update your profile</div>

<p class="label text-xs my-4"> Note: For the sake of your privacy, I recommend that you do not use your real picture or name.
    Also, you can always update your profile later in your Profile page
</p>

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
  <label class="flex justify-between" for="user_thumb_input">
    <legend class="text-base">Your profile pic</legend>
    <span class="label">1 MB max size</span>
  </label>
  <input id="user_thumb_input" name="thumb" type="file" class="file-input file-input-bordered w-full" accept="image/jpeg,image/png" />
  <label class="flex justify-end" for="user_thumb_input">
    <span class="label">Only jpeg, jpeg & png files</span>
  </label>
</fieldset>

<fieldset class="fieldset w-full gap-3">
  <label class="flex justify-between" for="user_pronouns_select">
    <legend class="text-base">Your pronouns</legend>
    <span class="label"></span>
  </label>
  <select id="user_pronouns_select" name="pronouns" class="btn border border-base-300">
  ${Object.values(UserPronouns)
		.map((item, i) => {
			return `<option class="text-xl">${item}</option>`;
		})
		.join('')}
</select>

  <label class="flex justify-end" for="user_pronouns_select">
    <span class="label"></span>
  </label>
</fieldset>



    <button class="btn btn-primary self-end min-w-32 mt-4">Save</button>
</form>
`;
};
