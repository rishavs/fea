import { Context } from 'hono';
import { HTMLResponse } from '../models/responses';
import { buildHTML } from '../html/buildHTML';
import { HTTPException } from 'hono/http-exception';

export const showErrorPage = async (c: Context, err: Error | HTTPException) => {
	console.error(err);

	let code = (err as HTTPException).status || 500;
	let name =
		code === 400
			? 'Bad Request'
			: code === 401
				? 'Authentication Error'
				: code === 403
					? 'Access Is Forbidden'
					: code === 404
						? 'Page Not Found'
						: code === 429
							? 'Too Many Requests'
							: code === 500
								? 'Internal Server Error'
								: code === 502
									? 'External Service Error'
									: code === 503
										? 'Server Is Down For Maintenance'
										: 'Something Has Gone Awry';
	let info =
		(err as HTTPException).message ||
		"You broke the server!! But don't worry, our best hamsters are working on it.";

	let res = new HTMLResponse();
	res.title = `Error: ${code} - ${name}`;
	res.description = info;

	// For generic errors, we won't show any cards so that there are no db calls
	res.cards = '';

	res.page = /*html*/ `
<div class="card bg-error mt-16 rounded-none lg:rounded-box">
	<div class="card-body">
		<div class="prose lg:prose-lg text-center self-center">
			<h1>☠ { <span id="error_code">${code}</span> }
				<span id="error_header"> ${name} </span>
			</h1>
			<h3 id="error_details"> ${info} </h3>
		</div>
	</div>
</div>
`;

	return c.html(buildHTML(res), code as any);
};
