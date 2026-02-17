import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SENSORS = [
  { id: "ISR-IRN", keywords: ["israel", "strike", "iran"] },
  { id: "USA-IRN", keywords: ["us", "military", "iran"] },
  { id: "IRN-ISR", keywords: ["iran", "strike", "israel"] },
  { id: "LEB-OPS", keywords: ["israeli", "ground", "lebanon"] }
];

export async function GET() {
  const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

  try {
    // Получаем ВСЕ активные рынки (увеличенный лимит до 500 для гарантии)
    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=500&closed=false', {
      headers: { 'User-Agent': UA },
      cache: 'no-store'
    });
    
    if (!res.ok) throw new Error('API_UNAVAILABLE');
    const allMarkets = await res.json();

    const results = SENSORS.map(sensor => {
      // Ищем рынок, где в вопросе есть хотя бы 2 ключевых слова из набора
      const match = allMarkets.find((m: any) => {
        const q = m.question.toLowerCase();
        const matches = sensor.keywords.filter(k => q.includes(k)).length;
        return matches >= 2; 
      });

      if (!match) return { id: sensor.id, prob: 0, status: "OFFLINE", title: `NO ACTIVE MARKET FOR ${sensor.id}` };

      // Извлекаем цену (универсальный парсер для структур 2026 года)
      let priceRaw = match.outcomePrices || match.price;
      if (typeof priceRaw === 'string' && priceRaw.startsWith('[')) priceRaw = JSON.parse(priceRaw);
      const prob = Math.round((Array.isArray(priceRaw) ? parseFloat(priceRaw[0]) : parseFloat(priceRaw)) * 100);

      return {
        id: sensor.id,
        prob: isNaN(prob) ? 0 : prob,
        status: "ACTIVE",
        title: match.question.toUpperCase()
      };
    });

    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json({ error: "UPLINK_CRITICAL_FAILURE" }, { status: 500 });
  }
}
