import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression('folder:dugun OR tags:dugun')
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    const photos = result.resources.map((file) => file.secure_url);

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Cloudinary çekme hatası:', error);
    return NextResponse.json({ photos: [] }, { status: 500 });
  }
}
