import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SENSORS = [
  { id: "ISR-IRN", words: ["israel", "strike", "iran"], desc: "Прямой удар Израиля по Ирану" },
  { id: "USA-LOG", words: ["us", "military", "iran"], desc: "Военная операция США против Ирана" },
  { id: "HORMUZ", words: ["strait", "hormuz"], desc: "Блокировка Ормузского пролива" },
  { id: "LEB-INV", words: ["lebanon", "ground"], desc: "Масштабное наземное вторжение в Ливан" }
];

export async function GET() {
  try {
    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=100', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 10 }
    });
    const markets = await res.json();

    const data = SENSORS.map(s => {
      const match = markets.find((m: any) => 
        s.words.every(word => m.question.toLowerCase().includes(word))
      );

      if (!match) return { id: s.id, prob: null, desc: s.desc };

      const prices = typeof match.outcomePrices === 'string' ? JSON.parse(match.outcomePrices) : match.outcomePrices;
      return {
        id: s.id,
        prob: Math.round(parseFloat(prices[0]) * 100),
        title: match.question,
        desc: s.desc,
        status: "ACTIVE"
      };
    });

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "API_TIMEOUT" }, { status: 500 });
  }
}
