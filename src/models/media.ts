
// ---------------------------------------
// Images Definitions
// ---------------------------------------
export const ImageTypesList = {
    avatar  : "avatar",
    post    : "post",
    thumb   : "thumb",
    og      : "og",
    icon    : "icon",
}
export type ImageType = (typeof ImageTypesList)[keyof typeof ImageTypesList];

export const ImageMimeTypeList = {
    jpeg    : "image/jpeg",
    png     : "image/png",
    webp    : "image/webp",
}
export const AllowedImageMimeTypes = Object.values(ImageMimeTypeList);
export type ImageMimeType = (typeof ImageMimeTypeList)[keyof typeof ImageMimeTypeList];

export type ImageMetadata = {
    type    : ImageType,
    width   : number,
    height  : number,
    size    : number,
    format  : ImageMimeType,
}