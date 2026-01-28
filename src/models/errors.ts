export type ServerErrorName =
	| 'Invalid Request Data'
	| 'Unauthorized Access'
	| 'Missing Session'
	| 'Invalid Session'
	| 'Resource Not Found'
	| 'Too Many Requests'
	| 'Internal Server Error'
	| 'Google Auth Error'
	| 'Database Error'
	| 'External Resource Error'
	| 'Service Unavailable';

export class ServerError extends Error {
	readonly code: number;
	readonly info: string;
	constructor(name: ServerErrorName, message?: string, info?: string) {
		if (!message) message = name;
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = name;
		switch (name) {
			case 'Invalid Request Data': this.code = 400; break;
			case 'Unauthorized Access': this.code = 403; break;
			case 'Missing Session': this.code = 401; break;
			case 'Invalid Session': this.code = 401; break;
			case 'Resource Not Found': this.code = 404; break;
			case 'External Resource Error': this.code = 422; break;
			case 'Too Many Requests': this.code = 429; break;
			case 'Internal Server Error': this.code = 500; break;
			case 'Google Auth Error': this.code = 503; break;
			case 'Database Error': this.code = 500; break;
			case 'Service Unavailable': this.code = 503; break;
			default: this.code = 500; break;
		}
		this.info =
			info ||
			"You broke the server!! But don't worry, our best hamsters are working on it.";
	}
}
