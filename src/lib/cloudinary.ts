import { v2 as cloudinary } from 'cloudinary';
import { convertToWebP } from './imageProcessor';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true,
});

export default cloudinary;

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