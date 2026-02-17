import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SENSORS = [
  { id: "ISR-IRN", tags: ["israel", "strike", "iran"] },
  { id: "USA-IRN", tags: ["us", "military", "iran"] },
  { id: "IRN-ISR", tags: ["iran", "strike", "israel"] },
  { id: "LEB-OPS", tags: ["israel", "lebanon", "ground"] }
];

export async function GET() {
  const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

  try {
    // 1. Принудительный дамп всех активных рынков (увеличиваем лимит)
    const response = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=1000&closed=false', {
      headers: { 'User-Agent': UA },
      next: { revalidate: 0 }
    });
    
    const allMarkets = await response.json();

    const results = SENSORS.map(sensor => {
      // 2. Поиск по весам: ищем рынок, где максимум совпадений тегов
      const match = allMarkets
        .map((m: any) => ({
          market: m,
          score: sensor.tags.filter(t => m.question.toLowerCase().includes(t)).length
        }))
        .filter(m => m.score >= 2)
        .sort((a, b) => b.score - a.score)[0]?.market;

      if (!match) return { id: sensor.id, prob: 0, status: "SEARCHING", title: `NO ACTIVE DATA FOR ${sensor.id}` };

      // 3. Извлечение цены из структуры 2026 года
      let price = 0;
      const raw = match.outcomePrices || match.price;
      try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        price = Array.isArray(parsed) ? parseFloat(parsed[0]) : parseFloat(parsed);
      } catch { price = parseFloat(raw || "0"); }

      return {
        id: sensor.id,
        prob: Math.round(price * 100),
        status: "LIVE",
        title: match.question.toUpperCase()
      };
    });

    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json({ error: "DATABASE_UNREACHABLE" }, { status: 500 });
  }
}
