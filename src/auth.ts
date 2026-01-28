// auth.ts
import { betterAuth } from 'better-auth';

export const auth = (
	env: CloudflareBindings,
): ReturnType<typeof betterAuth> => {
	return betterAuth({
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
			},
		},

		// Additional options that depend on env ...
	});
};
