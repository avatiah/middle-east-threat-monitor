import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MARKETS = [
  { id: "ISR-IRN", slug: "israel-strikes-iran-by-march-31-2026" },
  { id: "USA-IRN", slug: "us-military-strikes-iran-by-march-31" },
  { id: "IRN-ISR", slug: "iran-strikes-israel-by-march-31-2026" },
  { id: "LEB-OPS", slug: "israeli-ground-operation-in-lebanon-by-march-31" }
];

export async function GET() {
  try {
    const data = await Promise.all(MARKETS.map(async (m) => {
      try {
        const res = await fetch(`https://gamma-api.polymarket.com/markets?slug=${m.slug}`, {
          next: { revalidate: 0 }
        });
        const json = await res.json();
        const market = Array.isArray(json) ? json[0] : json;

        if (!market || !market.outcomePrices) return { id: m.id, prob: 0, status: "OFFLINE" };

        const prices = typeof market.outcomePrices === 'string' ? JSON.parse(market.outcomePrices) : market.outcomePrices;
        return {
          id: m.id,
          prob: Math.round(parseFloat(prices[0]) * 100),
          title: market.question.toUpperCase(),
          status: "LIVE"
        };
      } catch {
        return { id: m.id, prob: 0, status: "ERROR" };
      }
    }));

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "CRITICAL_UPLINK_LOST" }, { status: 500 });
  }
}
