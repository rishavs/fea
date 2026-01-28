import { Context } from 'hono';
import { buildHTML } from '../html/buildHTML';
import { buildSummaryCards } from '../html/fragments/summaryCard';
import { HTMLResponse } from '../models/responses';

export const showPostDetails = async (c: Context) => {
	let res = new HTMLResponse();
	res.title = 'Posts List';
	res.description = 'List of all posts';
	res.cards = buildSummaryCards();

	res.page = /*html*/ `
<h1>POst ID:  ${JSON.stringify(c.req.param('id'))}</h1>
`;

	return c.html(buildHTML(res));
};
