import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { auth } from './auth';
import { showPostDetails } from './handlers/showPostDetails';
import { showPostsList } from './handlers/showPostsList';
import { show404Error } from './handlers/show404Error';
import { HTTPException } from 'hono/http-exception';
import { showErrorPage } from './handlers/showErrorPage';
import postgres from 'postgres';
import { signin } from './handlers/signin';

type Variables = {
	sql: ReturnType<typeof postgres>;
};
const app = new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>();

// Setup the db connection in the context
app.use('*', async (c, next) => {
	const connString =
		c.env.HYPERDRIVE?.connectionString ??
		'postgresql://postgres:postgres@localhost:5432/postgres';

	c.set('sql', postgres(connString));
	await next();
});

app.get('/pingdb', async (c) => {
	const sql = c.get('sql');
	const result = await sql`SELECT 1 as result`;
	return c.json({ dbResult: result[0].result });
});

// ---------------------------------------------------------------
// Unprotected HTML & API Routes
// ---------------------------------------------------------------
app.get('/cat/:id', (c) => showPostsList(c));
app.get('/post/:id', (c) => showPostDetails(c));
app.get('/', (c) => showPostsList(c));

app.get('/api/data', (c) => c.json({ message: 'Unprotected API Data' }));

// ---------------------------------------------------------------
// Protected API Route - Example with simple API key check
// ---------------------------------------------------------------
app.get('/api/protected', (c) => c.json({ message: 'Protected API Data' }));

// ---------------------------------------------------------------
// Error routes
// ---------------------------------------------------------------
app.notFound((c) => show404Error(c));

app.get('/throw', (c) => {
	throw new HTTPException(412, {
		message: 'A very British error',
		cause: 'This is a tea cup exception!',
	});
});
app.get('/raise', (c) => {
	throw new Error('Just a regular error', { cause: 'Because I felt like it' });
});

app.onError((err, c) => showErrorPage(c, err));

// ---------------------------------------------------------------
// Better Auth APIs
// ---------------------------------------------------------------
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
	return auth(c.env).handler(c.req.raw);
});

app.get('/signin', (c) => signin(c));

app.get('/session', async (c) => {
	console.log(c.env);
	const session = await auth(c.env).api.getSession({
		headers: c.req.raw.headers,
	});
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

app.get('/login', (c) => {
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

export default app;
