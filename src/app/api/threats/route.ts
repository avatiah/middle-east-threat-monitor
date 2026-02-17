import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=100', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 10 }
    });
    const markets = await res.json();

    // База знаний о прошлых успешных сигналах (Hard-coded fallback)
    const sensors = [
      { id: "ISR-IRN", words: ["israel", "strike", "iran"], last: 36, vol: "2.1M", whale: "GC_WHALE_01" },
      { id: "USA-LOG", words: ["us", "military", "iran"], last: 14, vol: "890K", whale: "RETAIL" },
      { id: "HORMUZ", words: ["strait", "hormuz"], last: 19, vol: "1.2M", whale: "INSTITUTIONAL" },
      { id: "LEB-INV", words: ["lebanon", "ground"], last: 46, vol: "4.5M", whale: "GC_WHALE_01" }
    ];

    const data = sensors.map(s => {
      const match = markets.find((m: any) => s.words.every(w => m.question.toLowerCase().includes(w)));
      const currentProb = match ? Math.round(parseFloat(match.outcomePrices[0]) * 100) : s.last;
      
      return {
        id: s.id,
        prob: currentProb,
        volume: match ? Math.round(match.volume).toLocaleString() : s.vol,
        signature: s.whale,
        status: match ? "LIVE" : "STALE_HISTORY",
        sentiment: currentProb > 40 ? "AGGRESSIVE_ACCUMULATION" : "POSITION_MAINTAINED"
      };
    });

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "DATABASE_RECOVERY_MODE" }, { status: 500 });
  }
}
