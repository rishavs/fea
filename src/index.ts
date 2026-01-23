import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trimTrailingSlash } from 'hono/trailing-slash';

import {
	oidcAuthMiddleware,
	getAuth,
	revokeSession,
	processOAuthCallback,
	initOidcAuthMiddleware,
} from '@hono/oidc-auth';
import { auth } from './auth';

import { createAuthClient } from 'better-auth/client';

const app = new Hono();

// Testing auth with Better Auth

app.use(
	'/api/auth/*', // or replace with "*" to enable cors for all routes
	cors({
		origin: 'http://localhost:8787', // replace with your origin
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true,
	}),
);
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
	return auth.handler(c.req.raw);
});

app.get('/session', async (c) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!session) {
		return c.text('No active session', 401);
	}

	// Check if user is banned using KV (The "Denylist" pattern)
	// const isBanned = await c.env.KV.get(`ban:${session.user.id}`);
	// if (isBanned) {
	// 	return c.text("User is banned", 403);
	// }

	return c.json({ user: session.user, session: session.session });
});

// // Example admin endpoint to ban a user
// app.post("/admin/ban/:userId", async (c) => {
// 	// (Ensure you add admin auth checks here in production)
// 	const userId = c.req.param("userId");
// 	await c.env.KV.put(`ban:${userId}`, "true", { expirationTtl: 60 * 60 }); // Ban for 1 hr (cache)
// 	return c.text(`User ${userId} has been banned.`);
// });

// Unauthenticated routes
app.get('/', (c) => {
	return c.html(//
	/*html*/ `
	<h1>Welcome to Helios</h1>
	<p><a href="/signin">Sign In with Google</a></p>	

	<script type="module">
    import { createAuthClient } from "https://esm.sh/better-auth/client"

    const client = createAuthClient({
        baseURL: "http://localhost:8787" // Your backend URL
    })

    // Sign in function
    window.signIn = async () => {
        await client.signIn.social({
            provider: "google",
            callbackURL: "/session"
        })
    }

    // Sign out function
    window.signOut = async () => {
        await client.signOut()
        window.location.href = "/" 
    }
    </script>

<button onclick="signIn()">Sign in with Google</button>
<button onclick="signOut()">Sign Out</button>	
`);
});

app.get('/api/hello', (c) => {
	return c.json({
		ok: true,
		message: 'Hello Mridu!',
	});
});

export default app;
