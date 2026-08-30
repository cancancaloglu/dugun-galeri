import { NextResponse } from 'next/server';

export async function GET() {
  const cloudName = 'rb7os5iv';
  const apiKey = '715273585356887';
  const apiSecret = '1WwGolbd6hoWBq_CF6ymJBrQEAE';

  try {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
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
