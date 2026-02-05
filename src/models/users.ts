import * as v from 'valibot';

export enum UserRole {
	admin = 'admin',
	moderator = 'moderator',
	citizen = 'citizen',
}

export enum UserLevel {
	leaf = 'leaf',
	wood = 'wood',
	pebble = 'pebble',
	rock = 'rock',
	copper = 'copper',
	silver = 'silver',
	gold = 'gold',
	mithril = 'mithril',
}
export enum UserPronoun {
	None = 'None',
	He_Him = 'He/Him',
	She_Her = 'She/Her',
	They_Them = 'They/Them',
}

export const UserSchema = {
	nameMinLength: 4,
	nameMaxLength: 32,
	slugMinLength: 8,
	slugMaxLength: 64,
	thumbMinSize: 1,
	thumbMaxSize: 1024 * 1024,
	thumbFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

// Note: all fields are in snake_case to match the DB columns
export type User = {
	id?: string;
	google_id?: string;
	apple_id?: string;
	ext_id: string;

	slug: string;
	name: string;
	thumb: string;
	pronouns: UserPronoun;
	role: UserRole;
	level: UserLevel;

	banned_at?: Date;
	banned_till?: Date;
	banned_note?: string;
	total_banned_count?: number;

	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date;
};
