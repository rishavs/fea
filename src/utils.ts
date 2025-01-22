export const parseCookies = (cookie: string | null) => {
    let cookies: Record<string, string> = {}
    if (cookie) {
        let items = cookie.split(';')
        for (let item of items) {
            let [name, value] = item.split('=')
            cookies[name.trim()] = value
        }
    }
    return cookies
}

// const TIMEOUT = 5000; // Set timeout to 5 seconds
// export const fetchURL = (url: string, options: any) => {
//     return Promise.race([
//         fetch(url, options),
//         new Promise((_, reject) =>
//             setTimeout(
//                 () => reject(new Error('503', {cause:'Request timed out'})), 
//                 TIMEOUT
//             )
//         )
//     ]);
// };
