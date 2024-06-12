import { NextRequest, NextResponse } from 'next/server';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client } from '@aws-sdk/client-s3';
export const POST = async (request: NextRequest) => {
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });
    return NextResponse.json(s3Client);
  } catch (error) {
    return NextResponse.json(error);
  }
};
