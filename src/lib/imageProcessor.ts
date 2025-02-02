import sharp from 'sharp';

export async function convertToWebP(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return sharp(buffer).webp().toBuffer();
}
