import { SupabaseClient } from "@supabase/supabase-js";
import { NewPostTypes, PostCategories, UserPronouns } from "../pub/sharedDefs";
import { addUserInfoToSession } from "./handlers/apis/addUserInfoToSession";
import { showError } from "./handlers/pages/showError";
import { showHome } from "./handlers/pages/showHome";
import { showNewPost } from "./handlers/pages/showNewPost";
import { showPostDetails } from "./handlers/pages/showPostDetails";
import { showPostsList } from "./handlers/pages/showPostsList";
import { showUserDetails } from "./handlers/pages/showUserDetails";
import { callbackFromGoogle } from "./handlers/special/callbackFromGoogle";
import { signinToGoogle } from "./handlers/special/signinToGoogle";
import { signout } from "./handlers/special/signout";

// ---------------------------------------
// App Routes
// ---------------------------------------
export type AppRoute = {
    method: 'GET' | 'POST',
    path: URLPattern,
    allow: User['role'][],
    handler: (ctx: Context) => Promise<Response>,
}

const setRoute = (
    method: "GET" | "POST", 
    path: string, 
    allow: User['role'][], 
    handler: (ctx: Context) => Promise<Response>,

) => {
    return { method, path: new URLPattern({ pathname: path }) , allow, handler }
}

// Define routes
export const routes: AppRoute[] = [
    // dev routes
    // setRoute('GET', '/query', ['anonymous'], runDBQuery),

    // Static page routes
    setRoute('GET', '/', ['anonymous'], showHome),
    setRoute('GET', '/p/new', ['anonymous'], showNewPost),
    // setRoute('GET', '/throw', [], () => {throw new ServerError400("I threw a 400 err")}),
    
    // Special routes
    setRoute('GET', `/signin/google`, ['anonymous'], signinToGoogle),
    setRoute('GET', `/callback/google`, ['anonymous'], callbackFromGoogle),
    setRoute('GET', `/signout`, ['user', 'moderator', 'admin'], signout),
    
    // API routes
    setRoute('POST', `/api/save-user-demographic-info`, ['anonymous'], addUserInfoToSession),
    // setRoute('POST', `/api/update-user-details`, ['user', 'moderator', 'admin'], updateUserDetails),
    // setRoute('POST', `/api/save-new-post`, ['user', 'moderator', 'admin'], saveNewPost),
    // Dynamic error routes
    setRoute('GET', `/error/:id`, ['anonymous'], showError),
    
    // Dynamic page routes
    setRoute('GET', `/:cat`, ['anonymous'], showPostsList),
    setRoute('GET', `/:cat/:id`, ['anonymous'], showPostDetails),
    setRoute('GET', `/user/:slug`, ['anonymous'], showUserDetails),
];

// ---------------------------------------
// App Settings
// ---------------------------------------
export const Settings = {
    newSessionAge: 60 * 5, // 5 minutes
    maxSessionAge: 60 * 60 * 24 * 30 // 30 days = 
}

// ---------------------------------------
// Server Errors
// ---------------------------------------

// ---------------------------------------
// Server Messages/Triggers
// ---------------------------------------
export const ServerErrorMessages = {
    InvalidSession: {
        code: 401,
        header: "Invalid Session",
        userMsg: "Unable to login. Please delete all cookies and try again"
    },
    GoogleAuthError: {
        code: 503,
        header: "Google Auth Error",
        userMsg: "Unable to signin using the Google account. Please delete all cookies and try again later"
    },
    InvalidRequestData: {
        code: 400,
        header: "Invalid Request Data",
        userMsg: "Please check the form data and try again"
    },
    UnauthorizedAccess: {
        code: 401,
        header: "Unauthorized Access",
        userMsg: "Access to this resource is not allowed"
    },
    PageNotFound: {
        code: 404,
        header: "Page Not Found",
        userMsg: "The page you are looking for is in another castle"
    },
    InternalServerError: {
        code: 500,
        header: "Internal Server Error",
        userMsg: `Oh no! You just broke the internets! <br> But don't worry. We have our best hamsters on the job`
    },
    ServiceUnavailable: {
        code: 503,
        header: "Service Unavailable",
        userMsg: "Service is currently unavailable. Please try again later"
    },
    TooManyRequests: {
        code: 429,
        header: "Too Many Requests",
        userMsg: "Too many requests. Please try again later"
    }
} as const;
export type ServerErrorHeaderType = keyof typeof ServerErrorMessages;
export class ServerError extends Error {
    code: number;
    header: string;
    userMsg: string;
    toErrorPage: boolean;

    constructor(
        header: ServerErrorHeaderType,
        msg: string,
        toErrorPage?: boolean
    ) {
        super(msg); // error details is stored in the message property
        this.header = ServerErrorMessages[header].header;
        this.code = ServerErrorMessages[header].code;
        this.userMsg = ServerErrorMessages[header].userMsg;

        this.toErrorPage = toErrorPage ? toErrorPage : false;

        this.name = "Server Error " + this.code + ": " + this.header;
    }
}

// ---------------------------------------
// server Context
// ---------------------------------------
export type Context = {
    req: {
        raw: Request,
        url: URL,
        params: {
            cat?: string,
            slug?: string,
        },
        isSignedIn: boolean,
        user: User | null,
        allow: User['role'][],
        cookies: Record<string, string>,
    },
    env: Env,
    res: {
        status: number,
        headers: Headers,
        body: string,
    },
    db: SupabaseClient,

}

export type Page = {
    title: string,
    content: string,
}

// ---------------------------------------
// User Definitions
// ---------------------------------------
type UserRoles = 'admin' | 'moderator' | 'user' | 'anonymous'
type UserLevels = 'leaf' | 'wood' | 'pebble' | 'rock' | 'copper' | 'silver' | 'gold' | 'mithril'

export type User = {
    id?: string,
    google_id?: string,
    apple_id?: string,
    ext_id: string,

    slug: string,
    name: string,
    thumb: string,
    pronouns: (typeof UserPronouns)[keyof typeof UserPronouns]
    honorific: string,
    flair: string,
    role: UserRoles,
    level: UserLevels,
    stars: number,
    creds: number,
    gil: number,

    banned_at?: Date,
    banned_till?: Date,
    banned_note?: string,
    total_banned_count?: number,

    created_at?: Date,
    updated_at?: Date,
    deleted_at?: Date,
}

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

// ---------------------------------------
// Post Definitions
// ---------------------------------------
export type Post = {
    id: string,
    authorId: string,
    slug: string,
    category: (typeof PostCategories)[keyof typeof PostCategories]
    type: (typeof NewPostTypes)[keyof typeof NewPostTypes]
    title: string,
    link: string,
    thumb: string,
    content: string,
    displayScore: number,

    ogTitle?: string,
    ogDesc?: string,
    ogImage?: string,
    ogImageAlt?: string,
    ogIcon?: string,
    ogURL?: string,

    bodyImage?: string,

    isLocked?: boolean,
    lockedFor?: string,
    isAnonymous: boolean

    createdAt?: Date,
    updatedAt?: Date,
    archivedAt?: Date,
    lockedAt?: Date,
    deletedAt?: Date,
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
