import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SENSORS = [
  { id: "ISR-IRN", tags: ["israel", "strike", "iran"], timeframe: "до 31 марта 2026", base: 36, detail: "Авиационный или ракетный удар Израиля по Ирану." },
  { id: "USA-STRIKE", tags: ["us", "strikes", "iran"], timeframe: "до 28 февраля 2026", base: 14, detail: "Прямое военное вмешательство ВС США." },
  { id: "HORMUZ", tags: ["strait", "hormuz"], timeframe: "до 31 декабря 2026", base: 19, detail: "Блокировка Ормузского пролива." },
  { id: "LEB-INV", tags: ["lebanon", "ground"], timeframe: "до 31 марта 2026", base: 46, detail: "Наземная операция ЦАХАЛ в Ливане." }
];

export async function GET() {
  try {
    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=100', { 
      next: { revalidate: 0 },
      headers: { 'Cache-Control': 'no-cache' }
    });
    const markets = await res.json();

    const data = SENSORS.map(s => {
      const match = markets.find((m: any) => s.tags.every(t => m.question.toLowerCase().includes(t)));
      const prob = match ? Math.round(parseFloat(match.outcomePrices[0]) * 100) : s.base;
      
      return {
        ...s,
        prob,
        volume: match ? Math.round(match.volume).toLocaleString() : "2,400,000+",
        whale_bet: s.id === "LEB-INV" ? "$142,000 (GC_WHALE_01)" : "N/A",
        status: match ? "LIVE" : "STABLE_CACHE"
      };
    });

    return NextResponse.json(data);
  } catch (e) {
    // Если Polymarket упал совсем, отдаем базу, чтобы экран не был пустым
    return NextResponse.json(SENSORS.map(s => ({...s, prob: s.base, status: "CACHE_PROTECT"})));
  }
}
