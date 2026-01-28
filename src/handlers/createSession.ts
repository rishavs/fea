import { Context } from 'hono';
import { auth } from '../auth';
import { HTTPException } from 'hono/http-exception';

export const createSession = async (c: Context) => {
	// 1. if session not exists in cookie, raise error
	// 2. if session exists in cookie, check db if user exists
	// 3. if user exists, and user is banned, raise error
	// 4. if user exists, and user is not banned, add user info to a cookie
	// 5. if user does not exist, create user in db, then add user info to a cookie

	const session = await auth(c.env).api.getSession({
		headers: c.req.raw.headers,
	});
	if (!session) {
		throw new HTTPException(401, {
			message:
				'No active session was found. Please delete all cookies and try again.',
		});
	}

	// check if user exists in db
};
