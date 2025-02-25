import { s3Client } from '@/lib/utils';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import prisma from '../../prisma/client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;
const REGION = 'ap-southeast-1'; // Adjust if needed

export async function uploadToS3(buffer: Buffer, format: string, issueId: string) {
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}.${format}`;

    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: `image/${format}`,
    };

    try {
        await s3Client.send(new PutObjectCommand(params));
        const fileUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`;

        await prisma.issueImage.create({
            data: { issueId, imageUrl: fileUrl },
        });

        return fileUrl;
    } catch (error) {
        console.error(`Failed to upload ${fileName}:`, error);
        throw new Error(`S3 upload failed for ${fileName}`);
    }
}
