import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
        cache: 'no-store',
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      
      const json = await res.json();
      const market = json[0];

      if (!market) return { id: m.id, prob: 0, status: "NOT_FOUND", title: m.slug };

      // Извлекаем вероятность из всех возможных полей API
      let probValue = 0;
      if (market.outcomePrices) {
        const prices = typeof market.outcomePrices === 'string' ? JSON.parse(market.outcomePrices) : market.outcomePrices;
        probValue = parseFloat(prices[0]);
      } else if (market.price) {
        probValue = parseFloat(market.price);
      }

      return {
        id: m.id,
        prob: Math.round(probValue * 100),
        status: "ACTIVE",
        title: market.question || m.slug
      };
    }));

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "GATEWAY_ERROR" }, { status: 500 });
  }
}
