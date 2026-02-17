import { NextResponse } from 'next/server';

export const revalidate = 30; // Кэш на 30 секунд

const MARKETS = [
  { slug: "israel-strikes-iran-by-march-31-2026", id: "ISR-IRN" },
  { slug: "us-strikes-iran-by-march-31-2026", id: "USA-IRN" },
  { slug: "iran-strike-on-israel-by-march-31-2026", id: "IRN-ISR" },
  { slug: "israeli-ground-operation-in-lebanon-by-march-31", id: "LEB-OPS" }
];

export async function GET() {
  try {
    const data = await Promise.all(MARKETS.map(async (m) => {
      const res = await fetch(`https://gamma-api.polymarket.com/markets?slug=${m.slug}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const json = await res.json();
      const market = json[0];

      if (!market) return { id: m.id, prob: 0, title: "Market Not Found" };

      // ГЛАВНОЕ ИСПРАВЛЕНИЕ: Парсим строку в массив
      let prices = market.outcomePrices;
      if (typeof prices === 'string') {
        try { prices = JSON.parse(prices); } catch { prices = []; }
      }

      const prob = prices && prices.length > 0 ? Math.round(parseFloat(prices[0]) * 100) : 0;

      return {
        id: m.id,
        prob: prob,
        title: market.question
      };
    }));

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
