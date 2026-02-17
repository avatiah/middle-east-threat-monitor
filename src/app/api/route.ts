import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SENSORS = [
  { id: "ISR-IRN", q: "Israel strike Iran", tags: ["Israel", "Iran"] },
  { id: "USA-IRN", q: "US military Iran", tags: ["USA", "Iran"] },
  { id: "IRN-ISR", q: "Iran strike Israel", tags: ["Iran", "Israel"] },
  { id: "LEB-OPS", q: "Israel ground Lebanon", tags: ["Lebanon", "Israel"] }
];

export async function GET() {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

  try {
    // 1. Получаем расширенный список активных рынков (увеличиваем лимит)
    const response = await fetch(`https://gamma-api.polymarket.com/markets?active=true&limit=200`, {
      headers: { 'User-Agent': ua },
      next: { revalidate: 15 } 
    });
    const allMarkets = await response.json();

    const results = SENSORS.map(sensor => {
      // 2. Улучшенный поиск: ищем пересечение тегов и слов в заголовке
      const match = allMarkets.find((m: any) => {
        const title = m.question.toLowerCase();
        return sensor.tags.every(tag => title.includes(tag.toLowerCase())) || 
               title.includes(sensor.q.toLowerCase());
      });

      if (!match) {
        // Резервные данные, если рынок временно снят с листинга (аналитический прогноз)
        return { id: sensor.id, prob: 0, status: "NODE_OFFLINE", title: `SEARCHING_ACTIVE_STREAM_${sensor.id}` };
      }

      // 3. Извлечение цены из вложенных структур Polymarket 2026
      let price = 0;
      if (match.outcomePrices) {
        const p = typeof match.outcomePrices === 'string' ? JSON.parse(match.outcomePrices) : match.outcomePrices;
        price = parseFloat(p[0]);
      } else {
        price = parseFloat(match.price || "0");
      }

      return {
        id: sensor.id,
        prob: Math.round(price * 100),
        status: "LIVE",
        title: match.question.toUpperCase()
      };
    });

    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json({ error: "UPLINK_FAILURE" }, { status: 500 });
  }
}
