import postgres from 'postgres';
import { SecuritySession, SessionType } from './models/auth';
import { User, UserPronoun } from './models/users';
import { Post } from './models/posts';
import { Context } from 'hono';

export const Queries = {
	createUser: async (c: Context, user: User) => {
		const sql = c.get('sql');
		return sql`INSERT INTO users ${sql(user)}`;
	},

	getGoogleUser: async (c: Context, googleId: string) => {
		const sql = c.get('sql');
		return sql<User[]>`select
				id, google_id, ext_id, 
				slug, name, thumb, pronouns, role, level,
				banned_at, banned_till, banned_note, total_banned_count,
				created_at, updated_at, deleted_at
			from users
			where google_id = ${googleId}
			and deleted_at is null
			limit 1;
		`;
	},

	updateUserDetails: async (
		c: Context,
		userId: string,
		name: string,
		thumb: string,
		pronouns: UserPronoun,
	) => {
		const sql = c.get('sql');
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
	},

	countSimilarPostSlugs: async (c: Context, slug: string) => {
		const sql = c.get('sql');
		const result = await sql<{ count: number }[]>`
			select count(*)::int
			from posts
			where slug LIKE ${slug}%
		`;
		return result[0].count;
	},

	saveNewPost: async (c: Context, post: Post) => {
		const sql = c.get('sql');
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
	},
};
