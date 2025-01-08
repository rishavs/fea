export const mainScript = () => {
    return /*js*/`
    let cookieExists = (name) => {
        return document.cookie.split(";").some(
            (item) => item.trim().startsWith(name)
        )
    }

    window.addEventListener('load', () => {

        // ---------------------------------------
        // Maintenance for logged in users
        // ---------------------------------------
        if (localStorage.getItem('slug')) {
            // ---------------------------------------
            // Hydrate user profile button
            // ---------------------------------------
            document.querySelectorAll('[data-role="user-profile-img"]').forEach((el) => {
                el.src = decodeURIComponent(localStorage.getItem('thumb'))
            })

            document.querySelectorAll('[data-role="user-profile-name"]').forEach((el) => {
                el.textContent = decodeURIComponent(localStorage.getItem('name'))
            })

        }

        // ---------------------------------------
        // Auth
        // ---------------------------------------     
        if (cookieExists("D_SYNC_USER")) {

            // parse the user object from the cookie & add each attribute into local storage
            let user = JSON.parse(decodeURIComponent(
                document.cookie.split("D_SYNC_USER=")[1].split(";")[0]
            ));
            Object.keys(user).forEach((key) => {
                localStorage.setItem(key, user[key]);
            });

            // eat the new session cookie
            document.cookie = "D_SYNC_USER=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // refresh the page
            window.location.reload(true);
        } 
        
        if (cookieExists("D_FRE")) {

            console.log("FRE Triggered")
            // open fre modal
            let freModal = document.getElementById('fre_modal');
            freModal.showModal();
        
            // freModal.addEventListener('focus', () => {
                console.log("FRE Modal Loaded")
                // eat the fre cookie
                document.cookie = "D_FRE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // });
        }

        // ---------------------------------------
        // TODO - eat sectoken & nonce
        // ---------------------------------------
        if (cookieExists("D_SECTOK")) {
            document.cookie = "D_SECTOK=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
        if (cookieExists("D_NONCE")) {
            document.cookie = "D_NONCE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    });
    `
}

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
