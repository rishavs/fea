import { buildHTML } from '../html/buildHTML';
import { buildSummaryCards } from '../html/fragments/summaryCard';
import { HTMLResponse } from '../models/responses';
import { Context } from 'hono';

export const show404Error = async (c: Context) => {
	let res = new HTMLResponse();
	res.title = 'Not Found';
	res.description = 'The page you are looking for does not exist.';
	res.cards = buildSummaryCards();
	res.page = /*html*/ `
<article class="card bg-error mt-16 rounded-none lg:rounded-box w-full">
	<div class="card-body">
		<div class="card-actions justify-end">
			<button class="btn btn-square btn-sm lg:btn-md text-error">🗙</button>
		</div>
		<div class="prose lg:prose-lg text-center self-center">
			<h1>☠ { <span id="error_code">404</span> }
				<span id="error_header"> Page Not Found </span>
			</h1>
			<h3 id="error_details"> The page you are looking for does not exist. </h3>
		</div>
	</div>
</article>
`;
	return c.html(buildHTML(res), 404);
};
