import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';
import { patchIssueSchema } from '@/app/validationSchemas';
import { s3Client } from '@/lib/utils';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { Buffer } from 'buffer';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  try {
    const issueId = Number(params.id);

    // Check if the issue exists
    const existingIssue = await prisma.issue.findFirst({ where: { id: issueId } });
    if (!existingIssue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    // Parse form data
    const formData = await request.formData();
    const userId = formData.get('user_id')?.toString();
    const title = formData.get('title')?.toString();
    const priority = formData.get('priority')?.toString();
    const description = formData.get('description')?.toString();
    const files = formData.getAll('images') as File[];
    const deleteImages = JSON.parse(formData.get('delete_images') as string || '[]'); // List of image URLs to delete

    // Validate input
    const validation = patchIssueSchema.safeParse({ userId, title, description, priority });
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    // Delete specified images from S3
    if (deleteImages.length > 0) {
      for (const imageUrl of deleteImages) {
        const key = imageUrl.split('/').pop(); // Extract filename from URL
        await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
        await prisma.issueImage.deleteMany({ where: { issueId, imageUrl } });
      }
    }

    const uploadResults = [];

    // Upload new images to S3
    for (const file of files) {
      if (file instanceof File) {
        const fileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}.webp`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const webpBuffer = await sharp(buffer).webp().toBuffer();

        const params = {
          Bucket: BUCKET_NAME,
          Key: fileName,
          Body: webpBuffer,
          ContentType: 'image/webp',
        };

        await s3Client.send(new PutObjectCommand(params));
        const imageUrl = `https://${BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com/${fileName}`;

        uploadResults.push(imageUrl);

        await prisma.issueImage.create({
          data: { issueId, imageUrl },
        });
      }
    }

    // Update issue details
    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: { title, description, priority },
    });

    return NextResponse.json({
      message: 'Issue updated successfully',
      issue: updatedIssue,
      uploadedImages: uploadResults,
      deletedImages: deleteImages,
    });
  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
  }
}
