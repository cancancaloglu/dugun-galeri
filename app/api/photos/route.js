import { NextResponse } from 'next/server';

export async function GET() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  try {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?tags=true&max_results=100`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        cache: 'no-store',
      }
    );

    const data = await res.json();

    const dugunPhotos = data.resources
      ? data.resources
          .filter((img) => img.tags && img.tags.includes('dugun'))
          .map((img) => img.secure_url)
      : [];

    return NextResponse.json({ photos: dugunPhotos });
  } catch (error) {
    return NextResponse.json({ photos: [] }, { status: 500 });
  }
}
