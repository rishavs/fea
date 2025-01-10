import { NewPostSchema, UserControlsSchema } from './sharedDefs.js'

// ---------------------------------------
// Helpers
// ---------------------------------------
const cookieExists = (name) => {
    return document.cookie.split(";").some(
        (item) => item.trim().startsWith(name)
    )
}

const showErrorCard = async (code, header, details) => {
    document.getElementById("error_code").innerText = code
    document.getElementById("error_header").innerText = header
    document.getElementById("error_details").innerText = details
    document.getElementById("error_container").classList.remove("hidden")
}

// ---------------------------------------
// Auth
// ---------------------------------------    
if (cookieExists("D_SYNC_USER")) {
    console.log("User Sync Triggered")
    // parse the user object from the cookie & add each attribute into local storage
    let user = JSON.parse(decodeURIComponent(
        document.cookie.split("D_SYNC_USER=")[1].split(";")[0]
    ));
    Object.keys(user).forEach((key) => {
        localStorage.setItem(key, user[key] === 'null' ? "" : user[key]);
    });

    // eat the new session cookie
    document.cookie = "D_SYNC_USER=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // refresh the page
    window.location.reload();
} 

if (cookieExists("D_FRE")) {
    console.log("FRE Triggered")
    // open fre modal
    let freModal = document.getElementById('fre_modal');
    // @ts-ignore
    // freModal.showModal();

    // freModal.addEventListener('focus', () => {
        console.log("FRE Modal Loaded")
        // eat the fre cookie
        document.cookie = "D_FRE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // });
}
if (cookieExists("D_SECTOK")) {
    document.cookie = "D_SECTOK=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
if (cookieExists("D_NONCE")) {
    document.cookie = "D_NONCE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

signout_action.addEventListener("click", () => {
    console.log("Starting signout process....")
    // remove user details from client
    localStorage.clear();

    // signout
    window.location.href = '/signout';
})

// ------------------------------------------
// TODO - Tell the user about the punishment status, if any
//  Move to client side as we are sending the entire user object over to there
// ------------------------------------------
// if (user.warned_till && user.warned_till > new Date().toISOString()) {
//     ctx.res.headers.append('Set-Cookie', `D_TOAST_WARNING={for:${user.warned_for}, till:${user.warned_till}; path=/; SameSite=Strict;`)
// }
// if (user.exiled_till && user.exiled_till > new Date().toISOString()) {
//     ctx.res.headers.append('Set-Cookie', `D_TOAST_EXILE=You are exiled till ${user.exiled_till}; path=/; SameSite=Strict;`)
// }
// if (user.banned_till && user.banned_till > new Date().toISOString()) {
//     ctx.res.headers.append('Set-Cookie', `D_TOAST_BAN=You are banned till ${user.banned_till}; path=/; SameSite=Strict;`)
// }


// ---------------------------------------
// Hydrate user profile components
// ---------------------------------------
if (localStorage.getItem('slug')) {
    // Hydrate the header
    document.querySelectorAll('[data-role="signedin_controls"]').forEach((el) => {
        el.classList.remove('hidden');
    })
    document.querySelectorAll('[data-role="unsignedin_controls"]').forEach((el) => {
        el.classList.add('hidden');
    })

    let thumb = localStorage.getItem('thumb')
    document.querySelectorAll('[data-role="user-profile-img"]').forEach((el) => {
        // @ts-ignore
        el.src = decodeURIComponent(thumb)
    })

    let name = localStorage.getItem('name')
    document.querySelectorAll('[data-role="user-profile-name"]').forEach((el) => {
        el.textContent = decodeURIComponent(name)
    })

    let pronouns = localStorage.getItem('pronouns') === 'null' ? '' : localStorage.getItem('pronouns')
    document.querySelectorAll('[data-role="user-profile-pronouns"]').forEach((el) => {
        // @ts-ignore
        el.textContent = decodeURIComponent(pronouns)
    })
}

// update the user details in local storage when the user updates their profile 
window.addEventListener("storage", (event) => {
    if (event.key === 'name') {
        console.log("Detected update to user name. Refreshing DOM", event.newValue)
        document.querySelectorAll('[data-role="user-profile-name"]').forEach((el) => {
            el.textContent = decodeURIComponent(event.newValue)
        })
    }
    if (event.key === 'pronouns') {
        console.log("Detected update to user pronouns. Refreshing DOM", event.newValue)
        document.querySelectorAll('[data-role="user-profile-pronouns"]').forEach((el) => {
            el.textContent = decodeURIComponent(event.newValue)
        })
    }
    if (event.key === 'thumb') {
        console.log("Detected update to user thumb. Refreshing DOM", event.newValue)
        document.querySelectorAll('[data-role="user-profile-img"]').forEach((el) => {
            // @ts-ignore
            el.src = decodeURIComponent(event.newValue)
        })
    }
  });
  



// // ---------------------------------------
// // FRE Modal
// // ---------------------------------------    
let fre_modal = document.getElementById('fre_modal');

// Hydrate form
if (document.getElementById('user_details_form')) {
    user_name_input.value = localStorage.getItem('name') || "";
    user_name_input_char_count.innerText = user_name_input.value.length + "/" + UserControlsSchema.nameMaxLength + "chars";
    user_pronouns_select.value = localStorage.getItem('pronouns') === 'null' ? "None" : localStorage.getItem('pronouns');

    // Setup Interactivity
    user_name_input.addEventListener("input", () => {
        user_name_input_char_count.innerText = user_name_input.value.length + "/" + UserControlsSchema.nameMaxLength + "chars"
        document.querySelectorAll('[data-role="user-profile-name"]').forEach((el) => {
            el.textContent = user_name_input.value;
        })
    })

    user_thumb_input.addEventListener("change", async(e) => {
        let file = user_thumb_input.files[0];
        console.log("Thumb input changed", file)

        if ( file.size < 1 ) {
            user_thumb_input.setCustomValidity("Image file seems corrupted. Please upload a different image");
            user_thumb_input.reportValidity();
            user_thumb_input.value = "";
            return;
        }
        if ( file.size > 1024 * 1024 ) {
            user_thumb_input.setCustomValidity("Image file size should be smaller than 1 Mb in size");
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
                showErrorCard( "ERROR " + response.status, response.statusText, "Unable to update user details. Please try again later.");
            } else {
                console.log("User details updated successfully")
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            showErrorCard( "ERROR " , "Unable to update user details. Please try again later.", error);

        });
    });

}

// // ---------------------------------------
// // New Post page
// // ---------------------------------------
document.getElementById("post_type")?.addEventListener("click", async(e) => {
    if (post_type.checked) {

        post_link_controls.classList.remove("hidden")
        post_link_input.required = true
    } else {

        post_link_controls.classList.add("hidden")
        post_link_input.required = false
    }

})

document.getElementById("post_link_input")?.addEventListener("input", async(e) => {
    let numOfEnteredChars = post_link_input.value.length;
    post_link_char_count.innerText = numOfEnteredChars + "/" + NewPostSchema.linkMaxLength + " chars";
})

document.getElementById("post_title_input")?.addEventListener("input", async(e) => {
    let numOfEnteredChars = post_title_input.value.length;
    post_title_char_count.innerText = numOfEnteredChars + "/" + NewPostSchema.titleMaxLength + " chars";
})

document.getElementById("post_content_textarea")?.addEventListener("input", async(e) => {
    let numOfEnteredChars = post_content_textarea.value.length;
    content_char_count.innerText = numOfEnteredChars + "/" + NewPostSchema.contentMaxLength + " chars";
})