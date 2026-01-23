import { Hono } from 'hono';
const app = new Hono();

app.get('/post/:id', (c) => c.text('Post ID: ' + c.req.param('id')));
app.get('/', (c) => c.text('Hello Cloudflare Worksers!'));

export default app;
