'use client';
import React, { useEffect, useState } from 'react';

const THREATS = [
  { slug: "israel-strikes-iran-by-march-31-2026", title: "Удар Израиля по Ирану", cat: "ISR-IRN" },
  { slug: "us-strikes-iran-by-march-31-2026", title: "Удар США по Ирану", cat: "USA-IRN" },
  { slug: "iran-strike-on-israel-by-march-31-2026", title: "Удар Ирана по Израилю", cat: "IRN-ISR" },
  { slug: "israeli-ground-operation-in-lebanon-by-march-31", title: "Операция в Ливане", cat: "LEBANON" }
];

export default function ThreatEngine() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProb = async (slug) => {
    try {
      // Используем прямой запрос к API с параметром метки времени, чтобы избежать кэширования
      const response = await fetch(`https://gamma-api.polymarket.com/markets?slug=${slug}&t=${Date.now()}`);
      
      if (!response.ok) return 0;
      
      const markets = await response.json();
      if (markets && markets.length > 0 && markets[0].outcomePrices) {
        // Берем цену первого исхода (обычно "Yes")
        const price = parseFloat(markets[0].outcomePrices[0]);
        return Math.round(price * 100);
      }
    } catch (e) {
      console.error(`Error fetching ${slug}:`, e);
    }
    return 0;
  };

  useEffect(() => {
    const update = async () => {
      const results = await Promise.all(THREATS.map(async (t) => {
        const p = await fetchProb(t.slug);
        return { ...t, prob: p };
      }));
      
      setData(results);
      setLoading(false);
    };

    update();
    const interval = setInterval(update, 60000); // Обновление раз в минуту
    return () => clearInterval(interval);
  }, []);

  // Расчет индекса (защита от NaN: если данных нет, показываем 0)
  const totalRisk = data.length > 0 
    ? Math.round(data.reduce((acc, curr) => acc + (curr.prob || 0), 0) / data.length) 
    : 0;

  if (loading) return (
    <div style={{ background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace' }}>
      [ SCANNING_GLOBAL_VECTORS... ]
    </div>
  );

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #0f0', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '1px' }}>THREAT_ENGINE_V2.2</h1>
          <div style={{ fontSize: '10px', color: '#006600' }}>SYSTEM_TIME: {new Date().toISOString()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#006600' }}>GLOBAL_RISK_INDEX</div>
          <div style={{ fontSize: '48px', fontWeight: 'bold', lineHeight: '1' }}>{totalRisk}%</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ border: '1px solid #003300', padding: '20px', background: '#050505', boxShadow: '0 0 10px rgba(0,255,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '9px', border: '1px solid #006600', padding: '2px 6px' }}>{item.cat}</span>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: item.prob > 40 ? '#f00' : '#0f0' }}>
                {item.prob}%
              </span>
            </div>
            <h3 style={{ fontSize: '14px', margin: '0 0 20px 0', minHeight: '40px' }}>{item.title.toUpperCase()}</h3>
            
            <div style={{ height: '2px', background: '#111' }}>
              <div style={{ 
                height: '100%', 
                width: `${item.prob}%`, 
                background: item.prob > 40 ? '#f00' : '#0f0',
                boxShadow: item.prob > 40 ? '0 0 10px #f00' : 'none',
                transition: 'width 2s ease-in-out' 
              }} />
            </div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '60px', textAlign: 'center', fontSize: '10px', color: '#003300' }}>
        ESTABLISHED_LINK: 2026_UNIT_ALPHA // SOURCE: POLYMARKET_GAMMA_API
      </footer>
    </div>
  );
}
