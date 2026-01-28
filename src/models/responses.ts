export class APIResponse {
	message: string;
	data: any;

	constructor() {
		this.message = 'OK';
		this.data = {};
	}
}

export class HTMLResponse {
	title: string;
	description: string;
	page: string;
	cards: string;

	constructor() {
		this.title = 'Digglu';
		this.description = 'Default description';
		this.page = '<p>Default page content</p>';
		this.cards = '';
	}
}
