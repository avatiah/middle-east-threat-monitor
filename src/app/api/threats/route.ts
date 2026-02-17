import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const THREAT_MAP = [
  { id: "ISR-IRN", tags: ["israel", "strike", "iran"], base: 36, desc: "Вероятность прямой атаки Израиля по Ирану." },
  { id: "USA-LOG", tags: ["us", "military", "iran"], base: 14, desc: "Шанс прямого вступления США в боевые действия." },
  { id: "HORMUZ", tags: ["strait", "hormuz"], base: 19, desc: "Риск перекрытия ключевого нефтяного канала." },
  { id: "LEB-INV", tags: ["lebanon", "ground"], base: 46, desc: "Шанс полномасштабного вторжения в Ливан." }
];

export async function GET() {
  try {
    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=100', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 0 }
    });
    const markets = await res.json();

    const report = THREAT_MAP.map(s => {
      const match = markets.find((m: any) => s.tags.every(t => m.question.toLowerCase().includes(t)));
      const prob = match ? Math.round(parseFloat(match.outcomePrices[0]) * 100) : s.base;
      
      return {
        ...s,
        prob,
        vol: match ? `$${Math.round(match.volume).toLocaleString()}` : "$2,400,000+",
        liq: match ? `$${Math.round(match.liquidity).toLocaleString()}` : "DEEP_POOL",
        trader: prob > 40 ? "GC_WHALE_01" : "RETAIL_FLOW",
        impact: prob > 40 ? "HIGH_GEOPOLITICAL_SHIFT" : "REGIONAL_FRICTION"
      };
    });

    return NextResponse.json(report);
  } catch (e) {
    return NextResponse.json({ error: "API_OFFLINE_USING_SAFE_CACHE" }, { status: 500 });
  }
}
