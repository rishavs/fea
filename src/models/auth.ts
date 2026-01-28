export enum SessionType {
	anonymous = 'anonymous',
	security = 'security',
	authenticated = 'authenticated',
}

export type SecuritySession = {
	id: string; // session id
	type: SessionType; // session type
	nonce: string; // nonce for the session
	sec_token: string; // security token for the session, optional for anonymous sessions
	sec_token_set_at?: Date; // timestamp when the security token was set, optional for anonymous sessions
};

// export enum SessionType {
//     anon = "anon",
//     preauth = "pre-authenticated",
//     auth = "authenticated",
// }
