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
        next: { revalidate: 30 }
      });
      const data = await res.json();
      
      if (data && data.length > 0) {
        const market = data[0];
        
        // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Парсим outcomePrices, если это строка
        let prices = market.outcomePrices;
        if (typeof prices === 'string') {
          prices = JSON.parse(prices);
        }

        return {
          question: market.question,
          prob: prices && prices.length > 0 ? Math.round(parseFloat(prices[0]) * 100) : 0,
          category: market.groupItemTitle || "SECTOR_UNKNOWN"
        };
      }
      return null;
    }));

    return NextResponse.json(results.filter(Boolean));
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "API_OFFLINE" }, { status: 500 });
  }
}
