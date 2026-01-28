export const CommunityLinks = {
	faqs: 'FAQs',
	rules: 'Guidelines',
	cont: 'Contact Us',
};

export const LegalLinks = {
	terms: 'Terms of Use',
	priv: 'Privacy Policy',
	cook: 'Cookie Policy',
};

export type UserClientInfo = {
    navigator: {
        connection: {
            downlink:       number | null,
            effectiveType:  string | null,
            rtt:            number | null,
            saveData:       boolean | null, 
        },
        userAgent:          string | null,
        userAgentData: {
            brands:         string | null,
            mobile:         boolean | null,
        },
        platform: string | null,
        language: string | null,
    },
    window: {
        width: number | null,
        height: number | null,
        pixel_ratio: number | null,
        orientation: string | null,
    },

}