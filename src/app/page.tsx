'use client';
import React, { useEffect, useState } from 'react';

const THREAT_CONFIG = [
  { id: "isr-iran", slug: "israel-strikes-iran-by-march-31-2026", title: "Удар Израиля по Ирану", category: "ISRAEL-IRAN" },
  { id: "us-iran", slug: "us-strikes-iran-by-march-31-2026", title: "Удар США по Ирану", category: "USA-IRAN" },
  { id: "iran-isr", slug: "iran-strike-on-israel-by-march-31-2026", title: "Удар Ирана по Израилю", category: "IRAN-ISRAEL" },
  { id: "leb-inv", slug: "israeli-ground-operation-in-lebanon-by-march-31", title: "Операция в Ливане", category: "LEBANON" }
];

export default function Page() {
  const [threats, setThreats] = useState([]);
  const [totalRisk, setTotalRisk] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWithProxy = async (slug) => {
    // Пробуем несколько прокси, если первый не сработает
    const proxies = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(`https://gamma-api.polymarket.com/markets?slug=${slug}`)}`,
      `https://corsproxy.io/?https://gamma-api.polymarket.com/markets?slug=${slug}`
    ];

    for (const url of proxies) {
      try {
        const response = await fetch(url);
        const result = await response.json();
        // allorigins оборачивает ответ в поле contents
        const data = result.contents ? JSON.parse(result.contents) : result;
        
        if (data && data.length > 0) return Math.round(parseFloat(data[0].outcomePrices[0]) * 100);
      } catch (e) { console.error("Proxy error:", e); }
    }
    return 0;
  };

  useEffect(() => {
    const load = async () => {
      const results = await Promise.all(THREAT_CONFIG.map(async (t) => {
        const p = await fetchWithProxy(t.slug);
        return { ...t, prob: p };
      }));
      setThreats(results);
      const active = results.filter(r => r.prob > 0);
      setTotalRisk(active.length > 0 ? Math.round(active.reduce((a, b) => a + b.prob, 0) / active.length) : 0);
      setLoading(false);
    };
    load();
    const itv = setInterval(load, 60000);
    return () => clearInterval(itv);
  }, []);

  if (loading) return <div className="loading">_INITIALIZING_DATABASE...</div>;

  return (
    <main>
      <header style={{borderBottom: '1px solid #004400', marginBottom: '30px', paddingBottom: '20px'}}>
        <h1 style={{fontSize: '2rem', color: '#00ff00'}}>THREAT_ENGINE_V1.0</h1>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
          <span style={{fontSize: '10px'}}>STATUS: OPERATIONAL</span>
          <span style={{fontSize: '24px', color: '#00ff00'}}>INDEX: {totalRisk}%</span>
        </div>
      </header>

      {threats.map(t => (
        <div key={t.id} className="threat-card">
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span style={{fontSize: '12px', opacity: 0.6}}>{t.category}</span>
            <span className={`risk-value ${t.prob > 40 ? 'critical-text' : ''}`}>{t.prob}%</span>
          </div>
          <h2 style={{fontSize: '1.2rem', margin: '10px 0'}}>{t.title}</h2>
          <div className="progress-container">
            <div 
              className={`progress-fill ${t.prob > 40 ? 'critical' : ''}`} 
              style={{width: `${t.prob || 5}%`}} 
            />
          </div>
        </div>
      ))}
      
      <footer style={{fontSize: '10px', opacity: 0.4, marginTop: '40px', textAlign: 'center'}}>
        CONFIDENTIAL // POLYMARKET_REALTIME_SYNC // 2026
      </footer>
    </main>
  );
}
