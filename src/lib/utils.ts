import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRole(role: string | number): string {
  switch (String(role)) {
    case "0":
      return "Tester"
    case "1":
      return "Developer"
    case "2":
      return "Admin"
    default:
      return "Unknown"
  }
}

export const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const s3Init = async (key: string, fileType: string) => {
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: key, //filename with extension
    Conditions: [
      ['content-length-range', 0, 10485760], // up to 10 MB
    ],
    Fields: {
      acl: 'public-read',
      'Content-Type': fileType,
    },
    Expires: 600, // 10 minutes
  });
  return { url, fields };
};
