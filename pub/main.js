import { createAuthClient } from 'https://esm.sh/better-auth@1.4.17/client';
// ---------------------------------------
// Defs
// ---------------------------------------
export const UserSchema = {
	nameMinLength: 4,
	nameMaxLength: 32,
	slugMinLength: 8,
	slugMaxLength: 64,
	thumbMinSize: 1,
	thumbMaxSize: 1024 * 1024,
	thumbFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

// ---------------------------------------
// Register functions
// ---------------------------------------

// ---------------------------------------
// Read Cookies
// ---------------------------------------
const [slug, name, thumb, pronouns, role, level, show_fre] = await Promise.all([
	// user cookies
	cookieStore.get('user_slug'),
	cookieStore.get('user_name'),
	cookieStore.get('user_thumb'),
	cookieStore.get('user_pronouns'),
	cookieStore.get('user_role'),
	cookieStore.get('user_level'),

	// action cookies
	cookieStore.get('show_fre'),
]);

window.user = {};
window.actions = {};
window.user.slug = slug ? decodeURIComponent(slug.value) : undefined;
window.user.name = name ? decodeURIComponent(name.value) : undefined;
window.user.thumb = thumb ? decodeURIComponent(thumb.value) : undefined;
window.user.pronouns = pronouns
	? decodeURIComponent(pronouns.value)
	: undefined;
window.user.role = role ? decodeURIComponent(role.value) : undefined;
window.user.level = level ? decodeURIComponent(level.value) : undefined;

window.actions.show_fre = show_fre
	? decodeURIComponent(show_fre.value)
	: undefined;
console.log('User info from cookies:', window.user);
// ---------------------------------------
// Helpers
// ---------------------------------------

// ---------------------------------------
// Auth
// ---------------------------------------
const client = createAuthClient();

// Sign in function
window.signIn = async () => {
	await client.signIn.social({
		provider: 'google',
		callbackURL: '/signin',
	});
};

// Sign out function
window.signOut = async () => {
	await client.signOut();

	//delete all user info cookies
	await cookieStore.delete('user_slug');
	await cookieStore.delete('user_name');
	await cookieStore.delete('user_thumb');
	await cookieStore.delete('user_pronouns');
	await cookieStore.delete('user_role');
	await cookieStore.delete('user_level');

	// and other misc ones
	await cookieStore.delete('show_fre');

	window.location.href = '/';
};

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

if (window.user.slug && window.user.slug !== 'undefined') {
	// Hydrate the header
	document.querySelectorAll('[data-role="signedin_controls"]').forEach((el) => {
		el.classList.remove('hidden');
	});
	document
		.querySelectorAll('[data-role="unsignedin_controls"]')
		.forEach((el) => {
			el.classList.add('hidden');
		});

	document.querySelectorAll('[data-role="user-profile-img"]').forEach((el) => {
		// @ts-ignore
		el.src = window.user.thumb;
	});

	document.querySelectorAll('[data-role="user-profile-name"]').forEach((el) => {
		el.textContent = window.user.name;
	});

	document
		.querySelectorAll('[data-role="user-profile-pronouns"]')
		.forEach((el) => {
			// @ts-ignore
			el.textContent = window.user.pronouns;
		});
}

// ---------------------------------------
// FRE Modal
// ---------------------------------------
let fre_modal = document.getElementById('fre_modal');
if (window.actions.show_fre && window.actions.show_fre === 'true') {
	fre_modal.showModal();
	// Delete the cookie
	await cookieStore.delete('show_fre');
}

// Hydrate form
if (fre_modal.open) {
	console.log('FRE Modal is open. Hydrating form');
	user_name_input.value = window.user.name;
	user_name_input_char_count.innerText =
		user_name_input.value.length +
		'/' +
		UserControlsSchema.nameMaxLength +
		'chars';
	user_pronouns_select.value = window.user.pronouns;

	// Setup Interactivity
	user_name_input.addEventListener('input', () => {
		user_name_input_char_count.innerText =
			user_name_input.value.length +
			'/' +
			UserControlsSchema.nameMaxLength +
			'chars';
		document
			.querySelectorAll('[data-role="user-profile-name"]')
			.forEach((el) => {
				el.textContent = user_name_input.value;
			});
	});

	user_thumb_input.addEventListener('change', async (e) => {
		let file = user_thumb_input.files[0];
		console.log('Thumb input changed', file);

		if (file.size < 1) {
			user_thumb_input.setCustomValidity(
				'Image file seems corrupted. Please upload a different image',
			);
			user_thumb_input.reportValidity();
			user_thumb_input.value = '';
			return;
		}
		if (file.size > 1024 * 1024) {
			user_thumb_input.setCustomValidity(
				'Image file size should be smaller than 1 Mb in size',
			);
			user_thumb_input.reportValidity();
			user_thumb_input.value = '';
			return;
		}
		let reader = new FileReader();
		reader.onload = function (e) {
			document
				.querySelectorAll('[data-role="user-profile-img"]')
				.forEach((el) => {
					el.src = e.target.result;
				});
		};
		reader.readAsDataURL(file);
	});

	//     // Handle form submission
	//     user_details_form.addEventListener("submit", (event) => {
	//         event.preventDefault(); // Prevent the default form submission
	//         let user_data = new FormData(user_details_form);

	//         // if the form is embedded in the dialog, close the dialog
	//         fre_modal.close();

	//         // skip submission if the no data is changed
	//         if (user_data.get('name') === localStorage.getItem('name')
	//             && user_data.get('pronouns') === localStorage.getItem('pronouns')
	//             && user_data.get('thumb').name === ""
	//         ) {
	//             console.log("No change in profile details. Skipping submission");
	//             return;
	//         }

	//         // Use fetch API to submit the form
	//         fetch("/api/update-user-details", {
	//             method: "POST",
	//             body: new FormData(user_details_form),
	//         })
	//         .then(response => {
	//             if (!response.ok) {
	//                 console.error('Fetch Error:', response);
	//                 showErrorCard( "ERROR " + response.status, response.statusText, "Unable to update user details. Please try again later.");
	//             } else {
	//                 console.log("User details updated successfully")
	//             }
	//         })
	//         .catch(error => {
	//             console.error('Fetch Error:', error);
	//             showErrorCard( "ERROR " , "Unable to update user details. Please try again later.", error);

	//         });
	//     });
}

// // ---------------------------------------
// // New Post page
// // ---------------------------------------
