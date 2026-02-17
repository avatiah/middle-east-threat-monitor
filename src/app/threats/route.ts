import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SENSORS = [
  { id: "ISR-IRN", tags: ["israel", "strike", "iran"] },
  { id: "USA-IRN", tags: ["us", "military", "iran"] },
  { id: "IRN-ISR", tags: ["iran", "strike", "israel"] },
  { id: "LEB-OPS", tags: ["israel", "lebanon", "ground"] }
];

export async function GET() {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

  try {
    // Получаем широкий пласт рынков, чтобы найти скрытые события
    const response = await fetch(`https://gamma-api.polymarket.com/markets?active=true&limit=500&closed=false`, {
      headers: { 'User-Agent': ua },
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error('Uplink Blocked');
    const allMarkets = await response.json();

    const results = SENSORS.map(sensor => {
      // Алгоритм поиска по весам тегов
      const matches = allMarkets.filter((m: any) => {
        const q = m.question.toLowerCase();
        return sensor.tags.filter(tag => q.includes(tag)).length >= 2;
      });

      // Сортируем по релевантности (самый свежий/активный)
      const bestMatch = matches.sort((a: any, b: any) => (b.volume || 0) - (a.volume || 0))[0];

      if (!bestMatch) return { id: sensor.id, prob: 0, status: "SCANNING", title: `SEARCHING FOR ${sensor.id}...` };

      let rawPrice = bestMatch.outcomePrices || bestMatch.price;
      if (typeof rawPrice === 'string' && rawPrice.startsWith('[')) {
        rawPrice = JSON.parse(rawPrice)[0];
      } else if (Array.isArray(rawPrice)) {
        rawPrice = rawPrice[0];
      }

      const probability = Math.round(parseFloat(rawPrice as string) * 100);

      return {
        id: sensor.id,
        prob: isNaN(probability) ? 0 : probability,
        status: "LIVE",
        title: bestMatch.question.toUpperCase()
      };
    });

    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json({ error: "GATEWAY_TIMEOUT" }, { status: 504 });
  }
}
