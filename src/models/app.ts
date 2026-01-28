// ---------------------------------------
// App Settings
// ---------------------------------------
// Note: .env is only for items which need to be kept secret. All other settings should be in this file.
export const Settings = {
    newSessionAge: 60 * 10 * 1000, // 10 minutes
    maxSessionAge: 60 * 60 * 24 * 30 * 1000, // 30 days = 30 days in milliseconds
    imageHost: 'https://imagedelivery.net/your-image-host-id/', // replace with your image host id
    defaultThumbURL: '/assets/default-thumb.png',
}