import { customAlphabet } from 'nanoid';
import { ServerError } from '../models/errors';
import { UserPronoun, UserSchema } from '../models/users';
import { APIResponse } from '../models/responses';
import { ExecutionContext } from '@cloudflare/workers-types/experimental';
import { ServerContext } from '../models/context';
import { Context } from 'hono';

export const updateUserDetails = async (c: Context): Promise<Response> => {
	let res = new APIResponse();

	// Parse the incoming ctx.request as FormData
	const formData = await c.req.formData();
	console.log('Form Data: ', formData);

	// const freUser = Object.fromEntries(formData.entries()) as UserFREDetails

	const name = formData.get('name') as string;
	const thumb = formData.get('thumb') as File;
	const pronouns = formData.get('pronouns') as UserPronoun;

	// Validate form data
	// ctx.required fields: name, slug, pronouns
	if (
		name.length >= UserSchema.nameMinLength &&
		name.length <= UserSchema.nameMaxLength
		// && namePattern.test(name)
	) {
		ctx.user!.name = name;
	} else {
		throw new ServerError(
			'Missing Session',
			"User name doesn't meets the schema requirements",
			"User name doesn't meets the schema requirements",
		);
	}

	// Validate pronouns
	if (!Object.values(UserPronoun).includes(pronouns as UserPronoun)) {
		throw new ServerError(
			'Invalid Request Data',
			"User pronouns doesn't meet the schema requirements",
			"User pronouns doesn't meet the schema requirements",
		);
	}
	ctx.user!.pronouns = pronouns as UserPronoun;

	// Optional fields: thumb
	if (thumb) {
		console.log('Uploading Thumb file to R2: ', thumb);
		if (
			thumb.size < UserSchema.thumbMinSize ||
			thumb.size > UserSchema.thumbMaxSize
		) {
			throw new ServerError(
				'Invalid Request Data',
				`User thumb with size ${thumb.size} doesn't meets the schema requirements`,
				`User thumb with size ${thumb.size} doesn't meets the schema requirements`,
			);
		}

		if (!UserSchema.thumbFileTypes.includes(thumb.type)) {
			throw new ServerError(
				'Invalid Request Data',
				`User thumb with type ${thumb.type} doesn't meets the schema requirements`,
				`User thumb with type ${thumb.type} doesn't meets the schema requirements`,
			);
		}

		let fileId =
			customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 32)() +
			'__' +
			encodeURIComponent(thumb.name);

		const thumbBuffer = await thumb.arrayBuffer();
		let imgUpload = await ctx.env.IMAGES_R2_BUCKET.put(fileId, thumbBuffer, {
			httpMetadata: { contentType: thumb.type },
		});
		if (!imgUpload)
			throw new ServerError(
				'Service Unavailable',
				'Failed to upload thumb file to R2',
			);
		console.log('R2 object:', imgUpload);

		let thumbURL = ctx.env.IMAGE_HOST + '/' + fileId;
		ctx.user!.thumb = thumbURL;
	}

	// Update the user details in the database
	await ctx.db.updateUserDetails(
		ctx.user!.id as string,
		ctx.user!.name,
		ctx.user!.thumb,
		ctx.user!.pronouns,
	);
	console.log('User details updated in the database for user: ', ctx.user!.id);

	res.status = 201;
	res.message = 'User details updated successfully';
	res.data = {
		name: ctx.user!.name,
		pronouns: ctx.user!.pronouns,
		thumb: ctx.user!.thumb,
	};

	return res.build();

	// return new Response('', { headers: ctx.headers, status: 201 });
};
