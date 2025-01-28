// Generated by Wrangler by running `wrangler types`

interface Env {
	sessions: KVNamespace;
	SUPABASE_URL: string;
	SUPABASE_ANON_KEY: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	DOMAIN: string;
	STORAGE: R2Bucket;
	STATIC_FILES: Fetcher;
}
