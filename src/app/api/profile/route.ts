import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { s3Init } from '@/lib/utils';

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const formDataObj = Object.fromEntries(formData.entries());
    const { name, email, image } = formDataObj;
    const file = formData.get('image') as File;
    // const originalImage = image instanceof File ? image.name : image;
    const fileExtension =
      file instanceof File ? file.name.split('.').pop() : 'No file uploaded';
    const fileType = file instanceof File ? file.type : 'No file uploaded';
    // Key: Uses the generated key (filename with extension) to store the file in the bucket.
    const imageName =
      image instanceof File
        ? image.name.split('.').slice(0, -1).join('.')
        : image;
    const key = `${Date.now()}_${imageName}.${fileExtension}`;

    const updateData: { name?: string; image?: string } = {};

    try {
      if (image) {
        updateData.image = `${process.env.image_url}/${key}` as string;
      }
      if (name) {
        updateData.name = formData.get('name') as string;
      }
      const update = await prisma.user.update({
        where: { email },
        data: updateData,
      });
    } catch (error) {
      console.log(error, 'error by prisma');
    }
    const { url, fields } = await s3Init(key, fileType);

    return new Response(JSON.stringify({ url, fields }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error);
  }
};
