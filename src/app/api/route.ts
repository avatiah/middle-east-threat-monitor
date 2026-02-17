import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SENSORS = [
  { id: "ISR-IRN", words: ["israel", "strike", "iran"] },
  { id: "USA-LOG", words: ["us", "military", "iran"] },
  { id: "HORMUZ", words: ["strait", "hormuz"] },
  { id: "LEB-INV", words: ["lebanon", "ground"] }
];

export async function GET() {
  try {
    // Запрашиваем расширенные данные по активным рынкам
    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=100', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store'
    });
    const markets = await res.json();

    const data = SENSORS.map(s => {
      const match = markets.find((m: any) => 
        s.words.every(word => m.question.toLowerCase().includes(word))
      );

      if (!match) return { id: s.id, prob: null };

      const prices = typeof match.outcomePrices === 'string' ? JSON.parse(match.outcomePrices) : match.outcomePrices;
      
      return {
        id: s.id,
        prob: Math.round(parseFloat(prices[0]) * 100),
        title: match.question,
        volume: Math.round(match.volume).toLocaleString(), // Объем торгов (активность денег)
        liquidity: Math.round(match.liquidity).toLocaleString(), // Глубина рынка
        lastTrade: new Date(match.updatedAt).toLocaleTimeString(),
        status: "ACTIVE"
      };
    });

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "INTELLIGENCE_OFFLINE" }, { status: 500 });
  }
}
