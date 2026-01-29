import postgres from 'postgres';

export const parseCookies = (cookie: string | null) => {
	let cookies: Record<string, string> = {};
	if (cookie) {
		let items = cookie.split(';');
		for (let item of items) {
			let [name, value] = item.split('=');
			cookies[name.trim()] = value;
		}
	}
	return cookies;
};

export const connectToDB = (env) =>
	postgres(env.HYPERDRIVE.connectionString, {
		max: 5,
		fetch_types: false,
	});

export const urlSearchParamsToObject = (
	params: URLSearchParams,
	obj: Record<string, string>
): Record<string, string> => {
	for (const key of Object.keys(obj)) {
		if (
			!params.has(key) ||
			params.get(key) === null ||
			params.get(key) === ''
		) {
			throw new Error(
				`Search Params is missing a required parameter: ${key}`
			);
		}
		obj[key] = params.get(key) as string;
	}
	return obj;
};

export function randomBetween(min: number, max: number): number {
	if (min >= max) {
		throw new Error('Min must be less than max');
	}

	return Math.floor(Math.random() * (max - min + 1)) + min;
}
