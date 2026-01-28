import { HTMLResponse } from '../../models/responses';
import { buildSummaryCards } from '../html/fragments/summaryCard';
import { ServerContext } from '../../models/context';

export const showHome = async (ctx: ServerContext): Promise<Response> => {
	let res = new HTMLResponse();
	res.status = 200;
	res.title = 'Home Page';
	res.description = 'Welcome to the home page!';
	res.cards = [buildSummaryCards()];
	res.page = /*html*/ `
<h1>HOME</h1>
<p>Welcome to the home page!</p>
`;
	return res.build();
};
