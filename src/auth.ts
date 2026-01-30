// auth.ts
import { betterAuth } from 'better-auth';

export const auth = (
	env: CloudflareBindings,
): ReturnType<typeof betterAuth> => {
	return betterAuth({
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
			},
		},

		// Additional options that depend on env ...
	});
};
