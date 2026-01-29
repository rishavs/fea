import { Context } from 'hono';
import { auth } from '../auth';
import { HTTPException } from 'hono/http-exception';
import { Queries } from '../db';
import { User, UserLevel, UserPronoun, UserRole } from '../models/users';
import { customAlphabet } from 'nanoid';
import { randomBetween } from '../utils';
import { getRandomSlug } from '../slug';
import { setCookie } from 'hono/cookie';
import { set } from 'better-auth';

export const signin = async (c: Context) => {
	// 1. if session not exists in cookie, raise error
	// 2. if session exists in cookie, check db if user exists
	// 3. if user exists, and user is banned, raise error
	// 4. if user does not exist, create user in db, then add user info to a cookie
	// 5. Add user info to a cookie

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
	const result = await Queries.getGoogleUser(c, session.user.email);
	let user = {} as User;
	if (result.length === 0) {
		// create user in db
		console.log('User does not exist in db:', session.user.email);
		user = {
			id: customAlphabet(
				'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
				32,
			)(),
			google_id: session.user.email,
			ext_id: customAlphabet(
				'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
				32,
			)(),
			slug: getRandomSlug(),
			name: 'Nony Mouse',
			thumb: c.env.IMAGE_HOST + '/default0' + randomBetween(1, 8) + '.png',
			pronouns: UserPronoun.None,
			role: UserRole.citizen,
			level: UserLevel.leaf,
		};

		await Queries.createUser(c, user);
		console.log('Created new user in db:', user);
	} else {
		user = result[0];
	}

	// add a user info cookie
	setCookie(c, 'user_slug', user.slug);
	setCookie(c, 'user_name', user.name);
	setCookie(c, 'user_thumb', user.thumb);
	setCookie(c, 'user_pronouns', user.pronouns);
	setCookie(c, 'user_role', user.role);
	setCookie(c, 'user_level', user.level);

	// redirect to homepage
	return c.redirect('/');
};
