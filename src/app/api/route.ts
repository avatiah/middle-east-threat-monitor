import { NextResponse } from 'next/server';

const SLUGS = [
  "israel-strikes-iran-by-march-31-2026",
  "us-strikes-iran-by-march-31-2026",
  "iran-strike-on-israel-by-march-31-2026",
  "israeli-ground-operation-in-lebanon-by-march-31"
];

export async function GET() {
  try {
    const results = await Promise.all(SLUGS.map(async (slug) => {
      // Запрос идет от сервера Vercel, он не блокируется CORS
      const res = await fetch(`https://gamma-api.polymarket.com/markets?slug=${slug}`, {
        next: { revalidate: 30 } // Кэш на 30 секунд для скорости
      });
      const data = await res.json();
      return data[0] || null;
    }));

    return NextResponse.json(results.filter(Boolean));
  } catch (error) {
    return NextResponse.json({ error: "API Offline" }, { status: 500 });
  }
}
