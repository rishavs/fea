// auth.ts
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
	// Google OAuth Setup
	socialProviders: {
		google: {},
	},

	// Base URL for callbacks
	baseURL: 'http://localhost:8787',
});
