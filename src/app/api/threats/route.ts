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
      // Серверный запрос к Gamma API не ограничен политикой CORS браузера
      const res = await fetch(`https://gamma-api.polymarket.com/markets?slug=${slug}`, {
        next: { revalidate: 30 } // Кэширование на 30 секунд для молниеносной загрузки
      });
      
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    }));

    // Фильтруем пустые результаты и возвращаем JSON
    return NextResponse.json(results.filter(Boolean));
  } catch (error) {
    return NextResponse.json({ error: "API sync failed" }, { status: 500 });
  }
}
