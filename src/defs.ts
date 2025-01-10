import { SupabaseClient } from "@supabase/supabase-js";
import { NewPostTypes, PostCategories, UserPronouns } from "../pub/sharedDefs";

// ---------------------------------------
// App Settings
// ---------------------------------------
export const Settings = {
    newSessionAge: 60 * 5, // 5 minutes
    maxSessionAge : 60 * 60 * 24 * 30 // 30 days
}

// ---------------------------------------
// Server Errors
// ---------------------------------------
export class ServerError extends Error {
    header: string;
    details: string;
    internal: string;
    code: number;
    redirect?: string;

    constructor(code: 400 | 401 | 403 | 404 | 429 | 500 | 503 , details?: string, internal?: string, redirect?: string) {
        let errorHeader = "Internal Server Error"

        switch (code) {
            case 400: errorHeader = "Bad Request"; break;
            case 401: errorHeader = "Unauthorized Access"; break;
            case 403: errorHeader = "Access Forbidden"; break;
            case 404: errorHeader = "Page Not Found"; break;
            case 429: errorHeader = "Too Many Requests"; break;
            case 500: errorHeader = "Internal Server Error"; break;
            case 503: errorHeader = "Service Unavailable"; break;
        }

        super(errorHeader);
        
        this.code = code;
        this.header = errorHeader;
        this.details = details ? details : errorHeader;
        this.internal = internal ? internal : errorHeader;
        this.redirect = redirect;

        this.name = "Server Error " + this.code 

    }
}

// ---------------------------------------
// server Context
// ---------------------------------------
export type AppRoute = {
    method: 'GET' | 'POST',
    path: URLPattern,
    allow: User['role'][],
    handler: (ctx: Context) => Promise<Response>,
}

export type Context = {
	req: {
        raw: Request,
        url: URL,
        params: {
            cat?: string,
            slug?: string,
        }
        user: User | null,
        cookies: Record<string, string>,
    },
    env: Env,
	res: {
		status: 	number,
		headers: 	Headers,
		body: 	string,
	},
    db: SupabaseClient,
    
}

export type Page = {
	title: 		string,
	content: 	string,
    error:      ServerError | null,
}

// ---------------------------------------
// User Definitions
// ---------------------------------------
type UserRoles = 'admin' | 'moderator' | 'user' | 'anonymous'
type UserLevels = 'leaf' | 'wood' | 'pebble' | 'rock' | 'copper' | 'silver' | 'gold' | 'mithril'

export type User = {
    id?: 			    string,
    googleId?: 	        string,
    appleId?: 		    string,
    extId: 		        string,

    slug: 			    string,
    name: 			    string,
    thumb: 			    string,
    pronouns: 		    (typeof UserPronouns)[keyof typeof UserPronouns]
    honorific: 		    string,
    flair: 			    string,
    role: 			    UserRoles,
    level: 			    UserLevels,
    stars: 			    number,
    creds: 			    number,
    gil: 			    number,
   
    bannedAt?: 			Date,
    bannedTill?: 		Date,
    bannedNote?: 		string,
    totalBannedCount?: 	number,

    createdAt?: 		Date,
    updatedAt?: 		Date,
    deletedAt?: 		Date,
}

// ---------------------------------------
// Post Definitions
// ---------------------------------------
export type Post = {
    id:             string,
    authorId:       string,
    slug:           string,
    category:       (typeof PostCategories)[keyof typeof PostCategories]
    type:           (typeof NewPostTypes)[keyof typeof NewPostTypes]
    title:          string,
    link:           string,
    thumb:          string,
    content:        string,
    displayScore:   number,

    ogTitle?:       string,
    ogDesc?:        string,
    ogImage?:       string,
    ogImageAlt?:    string,
    ogIcon?:        string,
    ogURL?:         string,

    bodyImage?:     string,

    isLocked?:      boolean,
    lockedFor?:     string,
    isAnonymous:    boolean

    createdAt?:     Date,
    updatedAt?:     Date,
    archivedAt?:    Date,
    lockedAt?:      Date,
    deletedAt?:     Date,
}

export type PostLinkBodyImage = {
	src: string;
	width?: number;
	height?: number;
	area?: number;
};

export type PostLinkOGModel = {
	title?: string;
	desc?: string;
	image?: string;
	imageAlt?: string;
	icon?: string;
    url?: string;

    bodyImage?: string;
};

export const PostLinkOGSchema = {
    titleMaxLength: 1024,
    descMaxLength: 4096,
    urlMaxLength: 256,
    imageURLMaxLength: 256,
    iconURLMaxLength: 256,
    bodyImageURLMaxLength: 256,
}
