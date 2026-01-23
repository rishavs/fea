import { UserPronounsList, UserSchema } from "../defs";

export const freModal = () => {
    return /*html*/ `
<dialog id="fre_modal" class="modal modal-bottom lg:modal-middle">
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
            Feel free to update your profile here, or anytime later in the Profiles page.
        </p>

        <form id="user_details_form" class="w-full flex flex-col gap-2">
            <fieldset class="fieldset">
                <label class="flex justify-between">
                    <legend class="fieldset-legend">Your display name</legend>
                    <span id="user_name_input_char_count" class="label">0/${
                        UserSchema.nameMaxLength
                        } chars</span>
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

                <input id="user_thumb_input" name="thumb" type="file" class="file-input file-input-bordered w-full invalid:border-error valid:border-success" accept="image/jpeg,image/png" />

            </fieldset>

            <fieldset class="fieldset">
                <label class="flex justify-between">
                    <legend class="fieldset-legend">And your pronouns</legend>
                    <span class="fieldset-label">Select a preferred pronoun</span>
                </label>
                
                <select id="user_pronouns_select" name="pronouns" class="select select-bordered w-full invalid:border-error valid:border-success">

                    ${
                    Object.values(UserPronounsList)
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

<script type="text/javascript">

    // Hydrate form
    user_name_input.value = app.user.name || "";
    user_name_input_char_count.innerText = user_name_input.value.length + "/" + ${UserSchema.nameMaxLength} + "chars";
    user_pronouns_select.value = 
        !app.user.pronouns || app.user.pronouns === 'null' 
        ? "None" 
        : app.user.pronouns;

    // Setup Interactivity
    user_name_input.addEventListener("input", () => {
        user_name_input_char_count.innerText = user_name_input.value.length + "/" + ${UserSchema.nameMaxLength} + "chars"
        document.querySelectorAll('[data-role="user-profile-name"]').forEach((el) => {
            el.textContent = user_name_input.value;
        })
    })

    user_thumb_input.addEventListener("change", async(e) => {
        let file = user_thumb_input.files[0];
        console.log("Thumb input changed", file)

        if ( file && file.size < 1 ) {
            user_thumb_input.setCustomValidity("Image file seems corrupted. Please upload a different image");
            user_thumb_input.reportValidity();
            user_thumb_input.value = "";
            return;
        }
        if ( file && file.size > 1024  ) {
            user_thumb_input.setCustomValidity("Image file size should be smaller than 1 Mb");
            user_thumb_input.reportValidity();
            user_thumb_input.value = "";
            return;
        }
        let reader = new FileReader();
        reader.onload = function(e) {
            document.querySelectorAll('[data-role="user-profile-img"]').forEach((el) => {
                el.src = e.target.result;
            })
        }
        reader.readAsDataURL(file);
    })


    // Handle form submission
    user_details_form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the default form submission
        let user_data = new FormData(user_details_form);

        // if the form is embedded in the dialog, close the dialog
        fre_modal.close();

        // skip submission if the no data is changed
        if (user_data.get('name') === localStorage.getItem('name') 
            && user_data.get('pronouns') === localStorage.getItem('pronouns')
            && user_data.get('thumb').name === ""
        ) {
            console.log("No change in profile details. Skipping submission");
            return;
        }

        // Use fetch API to submit the form
        fetch("/api/update-user-details", {
            method: "POST",
            body: new FormData(user_details_form),
        })
        .then(response => {
            if (!response.ok) {
                console.error('Fetch Error:', response);
                app.showErrorCard( "ERROR " + response.status, response.statusText, "Unable to update user details. Please try again later.");
            } else {
                console.log("User details updated successfully")
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            showErrorCard( "ERROR " , "Unable to update user details. Please try again later.", error);

        });
    });

</script>
`
}