import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Прямой запрос к API Polymarket без промежуточного кэша
    const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&limit=100', {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    });
    
    const markets = await res.json();
    
    const findProb = (tags: string[]) => {
      const match = markets.find((m: any) => tags.every(t => m.question.toLowerCase().includes(t)));
      return match ? Math.round(parseFloat(match.outcomePrices[0]) * 100) : null;
    };

    const getDeadline = (tags: string[]) => {
      const match = markets.find((m: any) => tags.every(t => m.question.toLowerCase().includes(t)));
      return match ? new Date(match.endDate).toLocaleDateString('ru-RU') : "DATA_STREAM_ERROR";
    };

    const nodes = [
      { id: "ISR-IRN", tags: ["israel", "strike", "iran"], detail: "Удар Израиля по Ирану." },
      { id: "USA-STRIKE", tags: ["us", "strikes", "iran"], detail: "Удар США по объектам Ирана." },
      { id: "HORMUZ", tags: ["strait", "hormuz"], detail: "Закрытие Ормузского пролива." },
      { id: "LEB-INV", tags: ["lebanon", "ground"], detail: "Наземная операция в Ливане." }
    ].map(node => {
      const prob = findProb(node.tags);
      if (prob === null) throw new Error(`STALE_DATA_DETECTED_${node.id}`);
      
      return {
        ...node,
        prob,
        timeframe: getDeadline(node.tags),
        // Прямое извлечение объема и ликвидности для детекции реальных ставок
        volume: markets.find((m: any) => node.tags.every(t => m.question.toLowerCase().includes(t)))?.volume || 0,
        status: "LIVE_DATA_FEED"
      };
    });

    return NextResponse.json(nodes);
  } catch (e) {
    // Если данные не обновились или API не отвечает - возвращаем статус ошибки, а не старые %
    return NextResponse.json({ error: "CRITICAL_SYNC_FAILURE", detail: "Real-time data stream interrupted" }, { status: 503 });
  }
}
