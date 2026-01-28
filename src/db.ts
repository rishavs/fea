import postgres from 'postgres';
import { SecuritySession, SessionType } from './models/auth';
import { User, UserPronoun } from './models/users';
import { Post } from './models/posts';
import { Context } from 'hono';

export class DB {
	async getUserFromSession(c, sessionId: string) {
		const sql = postgres(c.env.DB_CONNECTION_STRING);
		return await sql<User[]>`
        SELECT u.id, u.google_id, u.ext_id, 
               u.slug, u.name, u.thumb, u.pronouns, u.role, u.level,
               u.banned_at, u.banned_till, u.banned_note, u.total_banned_count,
               u.created_at, u.updated_at, u.deleted_at
        FROM users u
        INNER JOIN sessions s ON u.id = s.user_id
        WHERE s.id = ${sessionId}
          AND u.deleted_at IS NULL
          AND s.type = ${SessionType.authenticated}
        LIMIT 1;
    `;
	}

	async addUserDetailsToSession(
		sessionId: string,
		userId: string,
		userAgent: string,
	) {
		await sql`
        update sessions
        set 
            type = ${SessionType.authenticated},
            user_id = ${userId},
            user_agent = ${userAgent},
            signedin_at = CURRENT_TIMESTAMP
        where 
            id = ${sessionId};
    `;
	}

	async createSecuritySession(session: SecuritySession) {
		await sql`
			insert into sessions (id, type, nonce, sec_token, sec_token_set_at)
			values (${session.id}, ${session.type}, ${session.nonce}, ${session.sec_token}, CURRENT_TIMESTAMP)
		`;
	}

	async getSecuritySession(sessionId: string) {
		return await sql<SecuritySession[]>`
			select id, type, nonce, sec_token, sec_token_set_at
			from sessions
			where id = ${sessionId}
			limit 1;
		`;
	}

	async deleteSession(sessionId: string) {
		await sql`
        delete from sessions
        where 
            id = ${sessionId};
        `;
	}

	async createUser(user: User) {
		return sql`       
            INSERT INTO users ${sql(
							user,
							'id',
							'google_id',
							'ext_id',
							'slug',
							'name',
							'thumb',
							'pronouns',
							'role',
							'level',
						)}
        `;
	}

	async getUserByGoogleId(googleId: string) {
		return sql<User[]>`
			select
				id, google_id, ext_id, 
				slug, name, thumb, pronouns, role, level,
				banned_at, banned_till, banned_note, total_banned_count,
				created_at, updated_at, deleted_at
			from users
			where google_id = ${googleId}
			and deleted_at is null
			limit 1;
		`;
	}

	async updateUserDetails(
		userId: string,
		name: string,
		thumb: string,
		pronouns: UserPronoun,
	) {
		await sql`
			update users
			set 
				name = ${name},
				thumb = ${thumb},
				pronouns = ${pronouns},
				updated_at = CURRENT_TIMESTAMP
			where 
				id = ${userId}
			and deleted_at is null;
		`;
	}

	async countSimilarPostSlugs(slug: string) {
		const result = await sql<{ count: number }[]>`
			select count(*)::int
			from posts
			where slug LIKE ${slug}%
		`;
		return result[0].count;
	}

	async saveNewPost(post: Post) {
		return sql`INSERT INTO posts ${sql(post)}`;
		// return sql`
		// 	INSERT INTO posts (
		// 		id, ext_id, author_id, slug, category, type, title, link, thumb,
		// 		content, display_score, og_title, og_description, og_image, og_image_alt, og_icon, og_url, body_image, body_image_alt, is_anonymous
		// 	) VALUES (
		// 		${post.id}, ${post.ext_id}, ${post.author_id}, ${post.slug}, ${post.category}, ${post.type}, ${post.title}, ${post.link}, ${post.thumb}, ${post.content}, ${post.display_score}, ${post.og_title}, ${post.og_description}, ${post.og_image}, ${post.og_image_alt},
		// 		${post.og_icon}, ${post.og_url}, ${post.body_image}, ${post.body_image_alt}, ${post.is_anonymous}
		// 	)
		// `;
	}
}
