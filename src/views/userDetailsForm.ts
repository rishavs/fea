import {UserControlsSchema, UserPronouns} from "../../pub/sharedDefs"

export const userDetailsForm = () => {
    return /*html*/`
    
    <div class="divider">Update your profile</div>

    <p class="text-xs opacity-50 my-4"> Note: For the sake of your privacy, I recommend that you do not use your real picture or name.
    Also, you can always update your profile later in your Profile page
    </p>

    <form id="user_details_form" class="w-full flex flex-col">

        <label class="form-control w-full">
            <div class="label">
                <span class="label-text">Your display name</span>
                
                <span id="user_name_input_char_count" class="label-text-alt opacity-50">0/${UserControlsSchema.nameMaxLength} chars</span>

            </div>

            <input id="user_name_input" name="name" type="text" class="input input-bordered w-full" value="" required title="Only letters, numbers, and single spaces allowed" minLength="${UserControlsSchema.nameMinLength}" maxLength="${UserControlsSchema.nameMaxLength}"/>
            
            <div class="label opacity-50">
                <span class="label-text-alt">Only letters, numbers, and single spaces 
                </span>
            </div>
        </label>

        <label class="form-control w-full">
            <div class="label">
                <span class="label-text">Your profile pic</span>

            </div>
            
            <input id="user_thumb_input" name="thumb" type="file" class="file-input file-input-bordered"  accept="image/jpeg,image/png"/>

            <div class="label">
                <span class="label-text-alt opacity-50">Max 1Mb size</span>
            </div>
        </label>

        <label class="form-control w-full">
            <div class="label">
                <span class="label-text">Your pronouns</span>
                <span class="label-text"></span>
            </div>
        
            <select id="user_pronouns_select" name="pronouns" class="btn border border-base-300">
                ${
                    Object.values(UserPronouns).map((item, i) => {
                        return `<option class="text-xl">${item}</option>`
                    }).join('')
                }
            </select>

            <div class="label">
                <span class="label-text-alt opacity-50"></span>
            </div>
        </label>
        
        <button class="btn btn-primary self-end min-w-32 mt-4">Save</button>
    </form>
    `
}