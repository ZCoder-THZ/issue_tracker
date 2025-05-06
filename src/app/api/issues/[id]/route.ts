import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';
import { patchIssueSchema } from '@/app/validationSchemas';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import { Buffer } from 'buffer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const assignDate = formData.get('assignedDate')?.toString();
    const deadlineDate = formData.get('deadlineDate')?.toString();
    const status = formData.get('status')?.toString();
    const assignedUserId = formData.get('assignedToUserId')?.toString();
    const files = formData.getAll('images') as File[];
    const deleteImages = JSON.parse(formData.get('delete_images') as string || '[]');

    // Convert dates to ISO-8601 format
    const assignedDate = assignDate ? new Date(assignDate).toISOString() : null;
    const deadlineDateISO = deadlineDate ? new Date(deadlineDate).toISOString() : null;

    // Validate input
    const validation = patchIssueSchema.safeParse({ userId, title, description, priority });
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    // Delete specified images
    if (files.length > 0) {
      for (const imageUrl of deleteImages) {
        try {
          await prisma.issueImage.deleteMany({ where: { issueId, imageUrl } });
        } catch (deleteError) {
          console.error('Failed to delete image:', deleteError);

        }
      }
    }

    const uploadResults = [];

    // Upload new images to Cloudinary
    for (const file of files) {
      if (file instanceof File) {
        const fileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}.webp`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const webpBuffer = await sharp(buffer).webp().toBuffer();

        let imageUrl = '';
        try {
          // Upload to Cloudinary
          const cloudinaryResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { resource_type: 'image', public_id: fileName, format: 'webp' },
              (error, result) => {
                if (error) {
                  console.error('Cloudinary upload failed:', error);
                  reject(new Error('Cloudinary upload failed'));
                } else {
                  resolve(result);
                }
              }
            ).end(webpBuffer);
          });

          imageUrl = cloudinaryResult?.secure_url || '';
        } catch (cloudinaryError) {
          console.error('Cloudinary upload failed:', cloudinaryError);
          throw new Error('Cloudinary upload failed');
        }

        uploadResults.push(imageUrl);

        await prisma.issueImage.create({
          data: { issueId, imageUrl },
        });
      }
    }

    // Update issue details in Prisma
    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        title,
        description,
        priority,
        assignedToUserId: assignedUserId,
        status,
        assignedDate, // Updated date
        deadlineDate: deadlineDateISO, // Updated date
      },
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

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  try {
    const issueId = Number(params.id);
    const deletedIssue = await prisma.issue.delete({ where: { id: issueId } });
    return NextResponse.json({ message: 'Issue deleted successfully', issue: deletedIssue });
  } catch (error) {
    console.error('Error deleting issue:', error);
    return NextResponse.json({ error: 'Failed to delete issue' }, { status: 500 });
  }
}