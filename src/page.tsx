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

  const getProb = async (slug) => {
    try {
      // Используем надежный прокси allorigins для обхода CORS
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://gamma-api.polymarket.com/markets?slug=${slug}`)}`);
      const json = await res.json();
      const markets = JSON.parse(json.contents);
      if (markets && markets.length > 0) {
        return Math.round(parseFloat(markets[0].outcomePrices[0]) * 100);
      }
    } catch (e) { console.error(e); }
    return 0;
  };

  useEffect(() => {
    const update = async () => {
      const results = await Promise.all(THREATS.map(async (t) => {
        const p = await getProb(t.slug);
        return { ...t, prob: p };
      }));
      setData(results);
      setLoading(false);
    };
    update();
    const interval = setInterval(update, 30000); // Обновление каждые 30 сек
    return () => clearInterval(interval);
  }, []);

  const totalRisk = data.length > 0 ? Math.round(data.reduce((a, b) => a + b.prob, 0) / data.length) : 0;

  if (loading) return <div style={{background:'#000',color:'#0f0',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace'}}>_SCANNING_VECTORS...</div>;

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace', boxSizing: 'border-box' }}>
      <header style={{ borderBottom: '1px solid #0f0', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', letterSpacing: '2px' }}>THREAT_ENGINE_V2.1</h1>
          <div style={{ fontSize: '10px', marginTop: '5px', color: '#006600' }}>GEOPOLITICAL_DATALINK_ACTIVE</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px' }}>GLOBAL_RISK</div>
          <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{totalRisk}%</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ border: '1px solid #004400', padding: '20px', background: '#050505', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <span style={{ fontSize: '10px', background: '#004400', color: '#000', padding: '2px 6px' }}>{item.cat}</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: item.prob > 40 ? '#f00' : '#0f0' }}>{item.prob}%</span>
            </div>
            <h3 style={{ fontSize: '16px', margin: '0 0 20px 0', lineHeight: '1.4' }}>{item.title.toUpperCase()}</h3>
            <div style={{ height: '6px', background: '#111', width: '100%' }}>
              <div style={{ height: '100%', width: `${item.prob}%`, background: item.prob > 40 ? '#f00' : '#0f0', transition: 'width 2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '60px', borderTop: '1px solid #002200', paddingTop: '20px', fontSize: '10px', color: '#004400', textAlign: 'center', letterSpacing: '1px' }}>
        ESTABLISHED_CONNECTION: 2026_SAT_LINK // DATA_STREAM_ENCRYPTED
      </footer>
    </div>
  );
}
