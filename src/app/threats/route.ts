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
      const res = await fetch(`https://gamma-api.polymarket.com/markets?slug=${slug}`, {
        next: { revalidate: 60 } // Кэширование на 1 минуту для скорости
      });
      const data = await res.json();
      return data[0] || null;
    }));

    return NextResponse.json(results.filter(Boolean));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
