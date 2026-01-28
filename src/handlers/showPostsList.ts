import { Context } from 'hono';
import { HTMLResponse } from '../models/responses';
import { buildSummaryCards } from '../html/fragments/summaryCard';
import { buildHTML } from '../html/buildHTML';

export const showPostsList = async (c: Context) => {
	let res = new HTMLResponse();
	res.title = 'Posts List';
	res.description = 'List of all posts';
	res.cards = buildSummaryCards();

	res.page = /*html*/ `
<h1>List of posts</h1>
`;
	return c.html(buildHTML(res));
};
