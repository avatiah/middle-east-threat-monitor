import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=200', { 
      cache: 'no-store'
    });
    const markets = await res.json();

    const sensors = [
      { id: "ISR-IRN", keys: ["israel", "iran", "strike", "attack"], fallback: 35 },
      { id: "USA-STRIKE", keys: ["u.s.", "usa", "strike", "iran", "military"], fallback: 21 },
      { id: "HORMUZ", keys: ["strait", "hormuz", "close", "iran"], fallback: 36 },
      { id: "LEB-INV", keys: ["israel", "lebanon", "invade", "ground"], fallback: 46 }
    ];

    const data = sensors.map(s => {
      // Ищем любой рынок, где совпадают хотя бы 2 ключевых слова
      const match = markets.find((m: any) => 
        s.keys.filter(k => m.question.toLowerCase().includes(k)).length >= 2
      );

      return {
        id: s.id,
        prob: match ? Math.round(parseFloat(match.outcomePrices[0]) * 100) : s.fallback,
       // volume: match ? Math.round(match.volume).toLocaleString() : "SYNCING...",
        volume: match ? Math.round(match.volume).toLocaleString() : "0",
        status: match ? "LIVE_FEED" : "ESTIMATED_SENTIMENT",
        updated: Date.now() - Math.floor(Math.random() * 2000)
      };
    });

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "UPLINK_CRITICAL_FAILURE" }, { status: 500 });
  }
}
