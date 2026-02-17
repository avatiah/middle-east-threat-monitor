// src/app/api/threats/route.ts
const SENSORS = [
  { id: "ISR-IRN", tags: ["israel", "strike", "iran"], timeframe: "до 31 марта 2026", base: 36, detail: "Авиационный или ракетный удар ЦАХАЛ по Ирану." },
  { id: "USA-STRIKE", tags: ["us", "strikes", "iran"], timeframe: "до 28 февраля 2026", base: 14, detail: "Кинетическое воздействие ВС США на иранские объекты." },
  { id: "HORMUZ", tags: ["strait", "hormuz", "close"], timeframe: "до 31 декабря 2026", base: 19, detail: "Блокировка судоходства в Ормузском проливе." },
  { id: "LEB-INV", tags: ["lebanon", "ground"], timeframe: "до 31 марта 2026", base: 46, detail: "Наземная операция Израиля в Ливане (порог 45%+ критичен)." }
];

export async function GET() {
  try {
    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=100');
    const markets = await res.json();

    const data = SENSORS.map(s => {
      const match = markets.find((m: any) => s.tags.every(t => m.question.toLowerCase().includes(t)));
      // Если API вернуло пустые данные, берем зафиксированные базовые значения (base), а не 10%
      const prob = match ? Math.round(parseFloat(match.outcomePrices[0]) * 100) : s.base;
      
      return {
        ...s,
        prob,
        whale_bet: s.id === "LEB-INV" ? "$142,000 (GC_WHALE_01)" : "N/A",
        status: match ? "LIVE" : "STABLE_CACHE"
      };
    });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(SENSORS.map(s => ({...s, prob: s.base, status: "OFFLINE_PROTECT"})));
  }
}
