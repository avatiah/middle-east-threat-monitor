import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Таймаут 4 секунды, чтобы API не висело вечно
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=100', {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal
    });
    clearTimeout(id);
    
    const markets = await res.json();
    
    const sensors = [
      { id: "ISR-IRN", tags: ["israel", "strike", "iran"] },
      { id: "USA-STRIKE", tags: ["us", "strikes", "iran"] },
      { id: "HORMUZ", tags: ["strait", "hormuz"] },
      { id: "LEB-INV", tags: ["lebanon", "ground"] }
    ];

    const data = sensors.map(s => {
      const match = markets.find((m: any) => s.tags.every(t => m.question.toLowerCase().includes(t)));
      
      return {
        id: s.id,
        // Если данных нет в эфире, возвращаем 0 и статус OFFLINE, но не валим систему
        prob: match ? Math.round(parseFloat(match.outcomePrices[0]) * 100) : 0,
        timeframe: match ? new Date(match.endDate).toLocaleDateString('ru-RU') : "N/A",
        volume: match ? match.volume : 0,
        status: match ? "LIVE" : "OFFLINE"
      };
    });

    return NextResponse.json(data);
  } catch (e) {
    // Возвращаем пустой массив, чтобы фронтенд знал, что связи нет
    return NextResponse.json([], { status: 503 });
  }
}
