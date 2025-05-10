import { v2 as cloudinary } from 'cloudinary';
import { convertToWebP } from './imageProcessor';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true,
});

export default cloudinary;
function extractPublicIdFromUrl(imageUrl: string): string {
    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?([^/.]+)(?:\.[^/.]+)*$/);
    if (!match || !match[1]) {
        throw new Error(`Invalid Cloudinary image URL: ${imageUrl}`);
    }
    return match[1];
}
export const uploadTOCloudinary = async (file: File) => {
    const webpBuffer = await convertToWebP(file);
    const cloudinaryResult = await new Promise<any>((resolve, reject) => {
        const fileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}.webp`;
        cloudinary.uploader.upload_stream(
            { resource_type: 'image', public_id: fileName, format: 'webp' },
            (error, result) => {
                if (error) {
                    reject(new Error('Cloudinary upload failed'));
                } else {
                    resolve(result);
                }
            }
        ).end(webpBuffer);
    });
    return cloudinaryResult?.secure_url || '';
};

export const deleteFromCloudinary = async (imageUrl: string) => {
    const publicId = extractPublicIdFromUrl(imageUrl);
    console.log(publicId);
    // @ts-ignore
    return await cloudinary.uploader.destroy(publicId + '.webp');
};