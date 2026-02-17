import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CORE_SENSORS = [
  { id: "ISR-IRN", tags: ["israel", "strike", "iran"], fallback: 36, whale: "MULTIPLE_RETAIL" },
  { id: "USA-LOG", tags: ["us", "military", "iran"], fallback: 14, whale: "STABLE_WATCH" },
  { id: "HORMUZ", tags: ["strait", "hormuz"], fallback: 19, whale: "INSTITUTIONAL_FLOW" },
  { id: "LEB-INV", tags: ["lebanon", "ground"], fallback: 46, whale: "GC_WHALE_01" }
];

export async function GET() {
  try {
    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=100', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store'
    });
    const markets = await res.json();

    const result = CORE_SENSORS.map(s => {
      const live = markets.find((m: any) => s.tags.every(t => m.question.toLowerCase().includes(t)));
      const prob = live ? Math.round(parseFloat(live.outcomePrices[0]) * 100) : s.fallback;
      
      return {
        ...s,
        prob,
        live_vol: live ? Math.round(live.volume).toLocaleString() : "SYNCING...",
        liquidity: live ? Math.round(live.liquidity).toLocaleString() : "ANALYTIC_MODE",
        title: live ? live.question : "MONITORING_ACTIVE_STREAM",
        status: live ? "ACTIVE_STREAM" : "CACHED_STABLE",
        last_update: new Date().toISOString()
      };
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: "UPLINK_TIMEOUT" }, { status: 500 });
  }
}
