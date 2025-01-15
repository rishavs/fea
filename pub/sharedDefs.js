// UI Definitions

// ---------------------------------------
// Links Definitions
// ---------------------------------------
export const CommunityLinks = {
	faqs 	: "FAQs",
	rules 	: "Guidelines",
	cont 	: "Contact Us",
}

export const LegalLinks = {
	terms 	: "Terms of Use",
	priv 	: "Privacy Policy",
	cook 	: "Cookie Policy",
}

// ---------------------------------------
// Post Definitions
// ---------------------------------------
export const PostSorting = {
	magic 		: "Magic",
	digs 		: "Digs",
	discussions : "Discussions",
	trending 	: "Trending",
	latest 		: "Latest",
}

export const NewPostTypes = {
    link: "link",
    text: "text" 
}

export const PostReportReason = {
    harassment	: 'Harassment', 
	violance	: "Threat of violance",
    guidelines	: 'Violates community guidelines', 
    spam		: 'Spam', 
    dox			: 'Sharing personal information', 
    harm		: 'Self harm', 
    illegal		: 'Illegal activity'
}

export const PostCategories = {
	meta 	: "Meta",
	tech 	: "Science & Tech",
	games 	: "Gaming",
	world 	: "World News",
	sport 	: "Sports",
	biz 	: "Business",
	life 	: "Lifestyle",
	media 	: "Entertainment",
	funny 	: "Funny",
	cute 	: "Cute Stuff",
	else 	: "Everything Else",
}

export const NewPostSchema = {
    titleMinLength : 16,
    titleMaxLength : 256,

    linkMinLength : 8,
    linkMaxLength : 256,

    contentMinLength : 32,
    contentMaxLength : 4096,
}

// ---------------------------------------
// User Definitions
// ---------------------------------------
export const UserPronouns = {
	none	: 'None',
	he		: 'He/Him',
	she		: 'She/Her',
	they	: 'They/Them'
}

export const UserControlsSchema = {
	nameMinLength : 4,
	nameMaxLength : 32,
	slugMinLength : 8,
	slugMaxLength : 64,
	thumbMinSize  : 1,
	thumbMaxSize  : 1024 * 1024,
	thumbFileTypes: ["image/jpeg", "image/png", "image/webp"],
}