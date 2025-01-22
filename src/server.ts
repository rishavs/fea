import { route } from "./router";

// Code to run only once when the server starts
// Later we can move items like route building, db connection, etc. here
( 
	async () => {
		// Add your initialization code here
    	console.log("Server is starting...");

	}
)();

export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.toml
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request, env, ctx): Promise<Response> {
		return route(request, env)
	},
} satisfies ExportedHandler<Env>;
