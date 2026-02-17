import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SEARCH_CONFIG = [
  { id: "ISR-IRN", q: "Israel strikes Iran", slug: "israel-strikes-iran-by-march-31-2026" },
  { id: "USA-IRN", q: "US strikes Iran", slug: "us-strikes-iran-by-march-31-2026" },
  { id: "IRN-ISR", q: "Iran strike on Israel", slug: "iran-strike-on-israel-by-march-31-2026" },
  { id: "LEB-OPS", q: "Israel ground operation Lebanon", slug: "israeli-ground-operation-in-lebanon-by-march-31" }
];

async function getMarketData(item: typeof SEARCH_CONFIG[0]) {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
  
  try {
    // ШАГ 1: Пробуем прямой Slug
    let res = await fetch(`https://gamma-api.polymarket.com/markets?slug=${item.slug}`, {
      headers: { 'User-Agent': ua },
      cache: 'no-store'
    });
    let data = await res.json();

    // ШАГ 2: Если пусто, ищем через глобальный поиск по активным рынкам
    if (!data || data.length === 0) {
      res = await fetch(`https://gamma-api.polymarket.com/search?q=${encodeURIComponent(item.q)}&active=true`, {
        headers: { 'User-Agent': ua },
        cache: 'no-store'
      });
      data = await res.json();
    }

    const market = data[0];
    if (!market) return { id: item.id, prob: 0, status: "OFFLINE", title: `SEARCH_FAILED: ${item.id}` };

    // Универсальный парсинг цены (учитываем все форматы 2026 года)
    let priceRaw = market.outcomePrices || market.price;
    if (typeof priceRaw === 'string') {
        try { priceRaw = JSON.parse(priceRaw); } catch { /* ignore */ }
    }
    
    const finalPrice = Array.isArray(priceRaw) ? priceRaw[0] : priceRaw;
    const probability = Math.round(parseFloat(finalPrice) * 100);

    return {
      id: item.id,
      prob: isNaN(probability) ? 0 : probability,
      status: "ACTIVE",
      title: market.question || item.q
    };
  } catch (e) {
    return { id: item.id, prob: 0, status: "ERROR", title: "CONNECTION_FAILURE" };
  }
}

export async function GET() {
  const results = await Promise.all(SEARCH_CONFIG.map(getMarketData));
  return NextResponse.json(results);
}
