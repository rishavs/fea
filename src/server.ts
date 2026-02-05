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
// TODO - revamp. handle api errors as well.
app.onError((err, c) => showErrorPage(c, err));

// ---------------------------------------------------------------
// Better-auth APIs
// ---------------------------------------------------------------
app.use(
	'/api/auth/*',
	cors({
		origin: [
			'http://localhost:8787',
			'https://digglu.com',
			'https://fea.mockingbird.workers.dev/',
		],
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true,
	}),
);
// Middleware to prevent caching of sensitive routes
// app.use('/auth/*', async (c, next) => {
//   await next()
//   c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
//   c.header('Pragma', 'no-cache')
//   c.header('Expires', '0')
// })
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
	return auth(c.env).handler(c.req.raw);
});
app.get('/signin', (c) => signin(c));

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

export default app;
