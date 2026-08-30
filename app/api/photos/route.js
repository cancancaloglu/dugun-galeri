import { NextResponse } from 'next/server';

export async function GET() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'rb7os5iv';
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ photos: [] });
  }

  try {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    // Doğrudan yüklenen tüm resimleri tür kısıtlaması olmadan getirir
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=50&type=upload`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        cache: 'no-store',
      }
    );

    const data = await res.json();

    const photos = data.resources
      ? data.resources.map((img) => img.secure_url)
      : [];

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Fotoğraf çekme hatası:', error);
    return NextResponse.json({ photos: [] }, { status: 500 });
  }
}
