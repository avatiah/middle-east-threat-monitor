import { NextResponse } from 'next/server';

// Актуальные рабочие ссылки на февраль 2026
const THREAT_MAP = [
  { slug: "israel-strikes-iran-by-march-31-2026", id: "ISR-IRN" },
  { slug: "us-strikes-iran-by-march-31-2026", id: "USA-IRN" },
  { slug: "iran-strike-on-israel-by-march-31-2026", id: "IRN-ISR" },
  { slug: "israeli-ground-operation-in-lebanon-by-march-31", id: "LEB-INV" }
];

export async function GET() {
  try {
    const results = await Promise.all(THREAT_MAP.map(async ({ slug, id }) => {
      const response = await fetch(`https://gamma-api.polymarket.com/markets?slug=${slug}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        next: { revalidate: 30 } // Умное кэширование Vercel
      });

      if (!response.ok) return { id, prob: 0, error: true };
      
      const data = await response.json();
      if (!data || data.length === 0) return { id, prob: 0, empty: true };

      const market = data[0];
      
      /** * ПРОФЕССИОНАЛЬНОЕ РЕШЕНИЕ:
       * В 2026 году Polymarket часто присылает outcomePrices как строку: "["0.12", "0.88"]"
       * Обычный код видит в этом массив символов и выдает 0. Мы это исправляем.
       */
      let rawPrices = market.outcomePrices;
      if (typeof rawPrices === 'string') {
        try { rawPrices = JSON.parse(rawPrices); } catch (e) { rawPrices = []; }
      }

      const probability = rawPrices && rawPrices.length > 0 
        ? Math.round(parseFloat(rawPrices[0]) * 100) 
        : 0;

      return {
        id,
        prob: probability,
        title: market.question,
        category: market.groupItemTitle || "SECTOR_GENERAL"
      };
    }));

    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ error: "GATEWAY_TIMEOUT" }, { status: 504 });
  }
}
