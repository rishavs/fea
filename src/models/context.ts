// ---------------------------------------
// server Context
// ---------------------------------------
import '@cloudflare/workers-types/experimental';
import { ExecutionContext } from '@cloudflare/workers-types/experimental';
import { DB } from '../db';
import { User, UserRole } from './users';
import { APIResponse, HTMLResponse } from './responses';
import { pong } from '../apiHandlers/pong';
import { throwError } from '../apiHandlers/throw';
import { updateUserDetails } from '../apiHandlers/updateUserDetails';
import { callbackFromGoogle } from '../authHandlers/callbackFromGoogle';
import { signinToGoogle } from '../authHandlers/signinToGoogle';
import { signout } from '../authHandlers/signout';
import { showErrorPage } from '../views/pages/showErrorPage';
import { showHome } from '../views/pages/showHome';
import { showPostsList } from '../views/pages/showPostsList';
import { showPostDetails } from '../views/pages/showPostDetails';
import { showNewPost } from '../views/pages/showNewPost';
import { postCategories } from './posts';

export type CookieName =
	| 'd_session_id'
	| 'd_session_nonce'
	| 'd_session_sec_token';

export type ServerContext = {
	req: Request;
	resource?: string;
	slug?: string;
	env: Env;
	exec: ExecutionContext;
	res: APIResponse | HTMLResponse;
	cookies: Record<CookieName, string>;
	db: DB;
	user?: User;
};

export const routes: [
	'GET' | 'POST',
	string,
	// 'public' | 'private', // authenticated
	UserRole[], // only allow these roles. Empty = public
	(ctx: ServerContext) => Promise<Response>
][] = [
	// API routes
	['GET', '/api/throw', [], throwError],
	['GET', '/api/ping', [], pong],
	['POST', '/api/update-user-details', [UserRole.admin, UserRole.moderator, UserRole.citizen], updateUserDetails],

	// Auth routes
	['GET', '/signin/google', [], signinToGoogle],
	['GET', '/callback/google', [], callbackFromGoogle],
	['GET', '/signout', [UserRole.admin, UserRole.moderator, UserRole.citizen], signout],

	// HTML routes
	['GET', '/error', [], showErrorPage],
	['GET', '/', [], showHome],
	['GET', '/p/new', [], showNewPost],
	['GET', '/p/:slug', [], showPostDetails],
	['GET', '/cat/:slug', [], showPostsList],
];
