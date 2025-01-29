import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/utils'; // Assuming s3Client is configured
import { PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { Buffer } from 'buffer';
import prisma from '../../../../prisma/client';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const userId = formData.get('user_id');
    const title = formData.get('title');
    const priority = formData.get('priority');
    const description = formData.get('description');
    const files = formData.getAll('images'); // Get all uploaded files
    const uploadResults = [];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    let issue;
    try {
      issue = await prisma.issue.create({
        data: {
          title: title.toString(),
          description: description.toString(),
          userId: userId.toString(),
          priority: priority.toString(),
        },
      });
    } catch (error) {
      console.log(error);
    }

    // Iterate over each file and upload to S3
    for (const file of files) {
      if (file instanceof File) {
        console.log('Processing file:', file.name);

        // Generate a numeric filename using timestamp + random number
        const fileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}.webp`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Convert image to webp format using sharp
        const webpBuffer = await sharp(buffer).webp().toBuffer();

        const params = {
          Bucket: BUCKET_NAME,
          Key: fileName,
          Body: webpBuffer,
          ContentType: 'image/webp',
        };

        try {
          // Upload to S3
          await s3Client.send(new PutObjectCommand(params));
          console.log(`Successfully uploaded file: ${fileName}`);

          uploadResults.push({
            fileName,
            url: `https://${BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com/${fileName}`,
          });

          await prisma.issueImage.create({
            data: {
              issueId: issue.id,
              imageUrl: `https://${BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com/${fileName}`,
            },
          });

        } catch (uploadError) {
          console.error(`Error uploading file: ${fileName}`, uploadError);
          return NextResponse.json(
            { error: `Failed to upload file: ${fileName}` },
            { status: 500 }
          );
        }
      } else {
        console.error('File is not a valid File instance', file);
        return NextResponse.json({ error: 'Invalid file format' }, { status: 400 });
      }
    }

    return NextResponse.json({
      msg: 'success',
      files: uploadResults,
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
