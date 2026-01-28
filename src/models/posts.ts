// ---------------------------------------
// Post Definitions
// ---------------------------------------
export const postSortingOrder = {
    magic       : 'Magic',
    digs        : 'Digs',
    discussions : 'Discussions',
    trending    : 'Trending',
    latest      : 'Latest',
} as const
export const postTypes = {
	link: 'Link',
	text: 'Text',
} as const
export type PostTypeKeys = keyof typeof postTypes;

export const PostReportReasons = {
    harassment	: 'Harassment', 
	violance	: "Threat of violance",
    guidelines	: 'Violates community guidelines', 
    spam		: 'Spam', 
    dox			: 'Sharing personal information', 
    harm		: 'Self harm', 
    illegal		: 'Illegal activity'
} as const;
export const postCategories = {
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
} as const;
export type PostCategoryKeys = keyof typeof postCategories;

export const newPostSchema = {
    titleMinLength  : 16,
    titleMaxLength  : 256,

    linkMinLength   : 8,
    linkMaxLength   : 256,

    contentMinLength: 32,
    contentMaxLength: 4096,

	imageMinSize    : 1024,         // 1KB
	imageMaxSize    : 5 * 1024 * 1024, // 5MB

	imageURLMinLength : 256,
	imageURLMaxLength : 256,

	bodyImageURLMinLength : 256,
	bodyImageURLMaxLength : 256,
};

export class PostSummary {
	constructor(
		public slug: string,
		public category: PostCategoryKeys,
		public description: string,
		public score: number
	) {}
}

// note: all fields are in snake_case to match the DB columns
export type Post = {
	id: string;
	ext_id: string;
	author_id: string;

	slug: string;
	category: PostCategoryKeys;
	type: PostTypeKeys;
	title: string;
	link: string;
	hero_image_full: string;
	hero_image_thumb: string;
	hero_image_alt: string;
	content: string;
	digs: number;

	og_title: string;
	og_description: string;
	og_image: string;
	og_image_alt: string;
	og_icon: string;
	og_url: string;
	body_image: string;
	body_image_alt: string;

	locked_for: string;
	is_anonymous: boolean;

	archived_at: Date;
	locked_at: Date;

	created_at: Date;
	updated_at: Date;
	deleted_at: Date;
}

export type PostLinkOGModel = {
	title: string;
	description: string;
	image: string;
	image_alt: string;
	icon: string;
	url: string;
	body_image: string;
	body_image_alt: string;
}