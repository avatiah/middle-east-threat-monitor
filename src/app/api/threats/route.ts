import { NextResponse } from 'next/server'; // Обязательный импорт для работы API в Next.js

export const dynamic = 'force-dynamic';

const SENSORS = [
  { 
    id: "ISR-IRN", 
    tags: ["israel", "strike", "iran"], 
    timeframe: "до 31 марта 2026", 
    base: 36, 
    detail: "Вероятность авиационного или ракетного удара Израиля по территории Ирана. Считается ключевым триггером большой войны." 
  },
  { 
    id: "USA-STRIKE", 
    tags: ["us", "strikes", "iran"], 
    timeframe: "до 28 февраля 2026", 
    base: 14, 
    detail: "Прямое военное вмешательство США. Низкий процент (14%) говорит о том, что рынок ждет действий скорее от союзников, чем от Вашингтона напрямую." 
  },
  { 
    id: "HORMUZ", 
    tags: ["strait", "hormuz", "close"], 
    timeframe: "до 31 декабря 2026", 
    base: 19, 
    detail: "Перекрытие Ормузского пролива Ираном. Это приведет к мировому энергетическому кризису. Сейчас риск оценивается как умеренный." 
  },
  { 
    id: "LEB-INV", 
    tags: ["lebanon", "ground"], 
    timeframe: "до 31 марта 2026", 
    base: 46, 
    detail: "Наземная операция ЦАХАЛ в Ливане. Самый горячий узел. Превышение порога 45% сигнализирует о высокой уверенности инсайдеров в начале операции." 
  }
];

export async function GET() {
  try {
    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=100', { cache: 'no-store' });
    const markets = await res.json();

    const data = SENSORS.map(s => {
      const match = markets.find((m: any) => s.tags.every(t => m.question.toLowerCase().includes(t)));
      const prob = match ? Math.round(parseFloat(match.outcomePrices[0]) * 100) : s.base;
      
      return {
        ...s,
        prob,
        // Визуализация ставки кита GC_WHALE_01 на основе ваших данных
        whale_bet: s.id === "LEB-INV" ? "142,000 USD" : "N/A",
        whale_id: s.id === "LEB-INV" ? "GC_WHALE_01" : null,
        status: match ? "LIVE" : "STABLE_CACHE"
      };
    });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(SENSORS.map(s => ({...s, prob: s.base, status: "OFFLINE_PROTECT"})));
  }
}
