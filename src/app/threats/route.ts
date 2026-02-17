import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const THREAT_SENSORS = [
  { id: "ISR-IRN", keywords: ["Israel", "Iran", "strike"], fallback: "israel-strikes-iran-by-march-31-2026" },
  { id: "USA-IRN", keywords: ["US", "Iran", "strike"], fallback: "us-strikes-iran-by-march-31-2026" },
  { id: "IRN-ISR", keywords: ["Iran", "strike", "Israel"], fallback: "iran-strike-on-israel-by-march-31-2026" },
  { id: "LEB-OPS", keywords: ["Israel", "Lebanon", "ground"], fallback: "israeli-ground-operation-in-lebanon-by-march-31" }
];

export async function GET() {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

  try {
    // Получаем ВСЕ активные рынки одним запросом (лимит 100 для скорости)
    const res = await fetch(`https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=100`, {
      headers: { 'User-Agent': ua },
      cache: 'no-store'
    });
    const allMarkets = await res.json();

    const results = THREAT_SENSORS.map(sensor => {
      // Ищем рынок, в вопросе которого есть ВСЕ ключевые слова
      const found = allMarkets.find((m: any) => 
        sensor.keywords.every(k => m.question.toLowerCase().includes(k.toLowerCase()))
      );

      if (!found) return { id: sensor.id, prob: 0, status: "SCAN_FAIL", title: `SEARCHING: ${sensor.keywords.join('+')}` };

      // Парсинг цены
      let p = found.outcomePrices || found.price;
      if (typeof p === 'string') try { p = JSON.parse(p); } catch { p = [0]; }
      const prob = Math.round(parseFloat(Array.isArray(p) ? p[0] : p) * 100);

      return {
        id: sensor.id,
        prob: isNaN(prob) ? 0 : prob,
        status: "LIVE",
        title: found.question
      };
    });

    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json({ error: "UPLINK_CRITICAL_FAILURE" }, { status: 500 });
  }
}
