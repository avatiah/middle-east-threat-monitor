import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SENSORS = [
  { id: "ISR-IRN", words: ["israel", "iran"] },
  { id: "USA-IRN", words: ["us", "iran", "military"] },
  { id: "IRN-ISR", words: ["iran", "attack", "israel"] },
  { id: "LEB-OPS", words: ["lebanon", "israel"] }
];

export async function GET() {
  try {
    // Делаем два целевых запроса, чтобы не пропустить рынки из разных категорий
    const [res1, res2] = await Promise.all([
      fetch('https://gamma-api.polymarket.com/markets?active=true&limit=100&query=iran', { cache: 'no-store' }),
      fetch('https://gamma-api.polymarket.com/markets?active=true&limit=50&query=lebanon', { cache: 'no-store' })
    ]);

    const m1 = await res1.json();
    const m2 = await res2.json();
    const all = [...m1, ...m2];

    const results = SENSORS.map(s => {
      // Ищем наиболее подходящий рынок по ключевым словам
      const match = all.find(m => 
        s.words.every(word => m.question.toLowerCase().includes(word))
      );

      if (!match) return { id: s.id, prob: 0, status: "OFFLINE", title: `NO_DATA_FOR_${s.id}` };

      // Надежный парсинг цены (обрабатывает и строки, и массивы)
      let price = 0;
      const raw = match.outcomePrices;
      if (raw) {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        price = parseFloat(parsed[0]);
      }

      return {
        id: s.id,
        prob: Math.round(price * 100) || 0,
        status: "LIVE",
        title: match.question.toUpperCase()
      };
    });

    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json({ error: "UPLINK_FAILURE" }, { status: 500 });
  }
}
