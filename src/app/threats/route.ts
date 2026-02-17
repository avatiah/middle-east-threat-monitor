import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Используем массив ключевых слов для каждого сектора
const CONFIG = [
  { id: "ISR-IRN", terms: ["israel", "iran", "strike"] },
  { id: "USA-IRN", terms: ["us", "military", "iran"] },
  { id: "IRN-ISR", terms: ["iran", "attack", "israel"] },
  { id: "LEB-OPS", terms: ["lebanon", "israel", "ground"] }
];

export async function GET() {
  try {
    // Шаг 1: Запрашиваем ВСЕ активные рынки в категории Политика/Геополитика
    const res = await fetch(`https://gamma-api.polymarket.com/markets?active=true&limit=100&closed=false`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store'
    });
    const markets = await res.json();

    const data = CONFIG.map(sensor => {
      // Шаг 2: Ищем наиболее подходящий рынок по совпадению ключевых слов
      const match = markets.find((m: any) => 
        sensor.terms.every(term => m.question.toLowerCase().includes(term))
      );

      if (!match) {
        return { 
          id: sensor.id, 
          prob: 0, 
          status: "STANDBY", 
          title: `SCANNING FOR ACTIVE ${sensor.id} MARKET...` 
        };
      }

      // Шаг 3: Универсальный парсинг цены (учитываем изменения API 2026)
      let price = match.outcomePrices || match.price;
      if (typeof price === 'string' && price.startsWith('[')) price = JSON.parse(price);
      const val = Array.isArray(price) ? parseFloat(price[0]) : parseFloat(price);

      return {
        id: sensor.id,
        prob: Math.round(val * 100) || 0,
        status: "LIVE",
        title: match.question.toUpperCase()
      };
    });

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "API_OFFLINE" }, { status: 500 });
  }
}
