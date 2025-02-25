import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

import { convertToWebP } from '@/lib/imageProcessor';
import { uploadToS3 } from '@/lib/upload';
import { uploadTOCloudinary } from '@/lib/cloudinary';
export async function POST(request: NextRequest) {

  try {
    const formData = await request.formData();
    const userId = formData.get('user_id')?.toString();
    const title = formData.get('title')?.toString();
    const priority = formData.get('priority')?.toString();
    const description = formData.get('description')?.toString();
    const stroageType = formData.get('storageType')?.toString();
    const files = formData.getAll('images');

    if (!userId || !title || !priority || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Create issue entry in DB
    const issue = await prisma.issue.create({
      data: { title, description, userId, priority },
    });

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        if (!(file instanceof File)) {
          throw new Error('Invalid file format');
        }

        const webpBuffer = await convertToWebP(file);
        let imageUrl = '';

        if (stroageType === 's3') {
          try {
            imageUrl = await uploadToS3(webpBuffer, 'webp', issue.id);
          } catch (s3Error) {
            console.error('S3 upload failed:', s3Error);
            throw new Error('S3 upload failed');
          }
        } else {
          imageUrl = await uploadTOCloudinary(file);
          await prisma.issueImage.create({
            data: {
              issueId: issue.id,
              imageUrl,
            },
          })
          if (!imageUrl) {
            throw new Error('Cloudinary upload failed');
          }
        }



        return imageUrl;
      })
    );

    return NextResponse.json({
      msg: 'success',
      files: uploadResults,
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}
