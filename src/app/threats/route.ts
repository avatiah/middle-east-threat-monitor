import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Конфигурация поиска для максимального покрытия
const SEARCH_QUERIES = [
  { id: "ISR-IRN", term: "Israel strikes Iran", backupSlug: "israel-strikes-iran-by-march-31-2026" },
  { id: "USA-IRN", term: "US strikes Iran", backupSlug: "us-strikes-iran-by-march-31-2026" },
  { id: "IRN-ISR", term: "Iran strike on Israel", backupSlug: "iran-strike-on-israel-by-march-31-2026" },
  { id: "LEB-OPS", term: "Israeli ground operation Lebanon", backupSlug: "israeli-ground-operation-in-lebanon-by-march-31" }
];

async function fetchMarket(query: any) {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
  
  try {
    // 1. Попытка получить напрямую по backupSlug
    let res = await fetch(`https://gamma-api.polymarket.com/markets?slug=${query.backupSlug}`, {
      headers: { 'User-Agent': userAgent },
      cache: 'no-store'
    });
    let data = await res.json();

    // 2. Если не найдено, используем поиск по ключевым словам
    if (!data || data.length === 0) {
      res = await fetch(`https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=1&query=${encodeURIComponent(query.term)}`, {
        headers: { 'User-Agent': userAgent },
        cache: 'no-store'
      });
      data = await res.json();
    }

    const market = data[0];
    if (!market) return { id: query.id, prob: 0, status: "OFFLINE", title: `SEARCH_FAILED: ${query.id}` };

    // Универсальный парсинг цены (строка или массив)
    let rawPrice = market.outcomePrices || market.price;
    if (typeof rawPrice === 'string' && rawPrice.startsWith('[')) {
      rawPrice = JSON.parse(rawPrice)[0];
    } else if (Array.isArray(rawPrice)) {
      rawPrice = rawPrice[0];
    }

    return {
      id: query.id,
      prob: Math.round(parseFloat(rawPrice as string) * 100) || 0,
      status: "ACTIVE",
      title: market.question
    };
  } catch (e) {
    return { id: query.id, prob: 0, status: "ERROR", title: "CONNECTION_LOST" };
  }
}

export async function GET() {
  const results = await Promise.all(SEARCH_QUERIES.map(q => fetchMarket(q)));
  return NextResponse.json(results);
}
