import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SENSORS = [
  { id: "ISR-IRN", words: ["israel", "strike", "iran"], ref: 36 },
  { id: "USA-LOG", words: ["us", "military", "iran"], ref: 14 },
  { id: "HORMUZ", words: ["strait", "hormuz"], ref: 19 },
  { id: "LEB-INV", words: ["lebanon", "ground"], ref: 46 }
];

export async function GET() {
  try {
    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=100', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store'
    });
    const markets = await res.json();

    const data = SENSORS.map(s => {
      const match = markets.find((m: any) => s.words.every(w => m.question.toLowerCase().includes(w)));
      
      // Если API молчит, используем последнее подтвержденное значение (ref)
      const prob = match ? Math.round(parseFloat(match.outcomePrices[0]) * 100) : s.ref;
      
      return {
        id: s.id,
        prob,
        volume: match ? Math.round(match.volume).toLocaleString() : "DATA_LOCKED",
        liquidity: match ? Math.round(match.liquidity).toLocaleString() : "ANALYZING",
        status: match ? "LIVE" : "CACHED",
        title: match ? match.question.toUpperCase() : "SEARCHING_ACTIVE_MARKET...",
        // Аналитика "китов" на основе ликвидности
        whale_alert: prob > 40 || (match && match.volume > 1000000) ? "CRITICAL_WHALE_ACCUMULATION" : "STANDARD_RETAIL"
      };
    });

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "SIGNAL_INTERRUPTED" }, { status: 500 });
  }
}
