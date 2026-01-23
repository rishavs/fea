import { PostLinkBodyImage, PostLinkOGModel, PostLinkOGSchema } from "../../defs";

export const getOGDataFromURL = async (link: URL): Promise<PostLinkOGModel> => {
    const resPostLink 	= await fetch(link);

	let ogData = {} as PostLinkOGModel;
	let bodyImagesArray: PostLinkBodyImage[] = [];

	const rewriter = new HTMLRewriter()
		.on('meta[property="og:title"]', { element(el) {
                let title = el.getAttribute('content')
                if (!title) return;

				ogData.title = title.length < PostLinkOGSchema.titleMaxLength ? title : title.slice(0, PostLinkOGSchema.titleMaxLength);
			},
		})
		.on('meta[property="og:description"]', {
			element(el) {
                let desc = el.getAttribute('content')
                if (!desc) return;

				ogData.desc = desc.length < PostLinkOGSchema.descMaxLength ? desc : desc.slice(0, PostLinkOGSchema.descMaxLength);
			},
		})
        .on('meta[property="og:url"]', {
			element(el) {
				let url = el.getAttribute('content');
                if (!url) return;

                ogData.url = url.length < PostLinkOGSchema.urlMaxLength ? url : undefined;
			},
		})
		.on('meta[property="og:image"]', {
			element(el) {
				let image = el.getAttribute('content');
                if (!image) return;

                ogData.image = image.length < PostLinkOGSchema.imageURLMaxLength ? image : undefined;
			},
		})
		.on('meta[property="og:image:alt"]', {
			element(el) {
				let imageAlt = el.getAttribute('content');
                if (!imageAlt) return;

                ogData.imageAlt = imageAlt.length < PostLinkOGSchema.imageURLMaxLength ? imageAlt : undefined;
			},
		})
        .on('link[rel="icon"]', {
            element: el => {
                let icon = el.getAttribute('href');
                if (!icon) return;

                ogData.icon = icon.length < PostLinkOGSchema.iconURLMaxLength ? icon : undefined;
            },
        })
		.on('img', {
			element(el) {
                // if og:image exists, skip
                if(ogData.image) return;

				const src = el.getAttribute('src');
                if (!src) return;
				const width = el.getAttribute('width');
				const height = el.getAttribute('height');
				const area = width && height ? parseInt(width) * parseInt(height) : 0;
				if (src) {
					bodyImagesArray.push(
						{ 
							src, 
							width: width ? parseInt(width): undefined, 
							height: height ? parseInt(height) : undefined, 
							area: area ?? 0 
						});
				}

			},
		})

    await rewriter.transform(resPostLink).text(); 
    // set the image with largest area as the body image. else use the first image
	if (!ogData.image && bodyImagesArray.length > 0) {
		const bodyImage = bodyImagesArray.reduce((prev, current) => (prev.area ?? 0) > (current.area ?? 0) ? prev : current);
		ogData.bodyImage = bodyImage.src.length < PostLinkOGSchema.bodyImageURLMaxLength ? bodyImage.src : undefined
	}

	return ogData;
}
