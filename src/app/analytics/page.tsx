'use client';
import React, { useEffect, useState } from 'react';

export default function HistoricalAnalytics() {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<Record<string, number[]>>({});
  const [prices, setPrices] = useState({ brent: 84.20, gold: 2045.10 });
  const [now, setNow] = useState(Date.now());

  // OSINT Метрики для связки с энергоносителями
  const OSINT_METRICS: any = {
    "ISR-IRN": { oil_impact: "+$2.50", gold_impact: "+$15", signal: "STRAIT_TENSION" },
    "USA-STRIKE": { oil_impact: "+$4.10", gold_impact: "+$30", signal: "CARRIER_DEPLOY" },
    "HORMUZ": { oil_impact: "+$12.00", gold_impact: "+$10", signal: "BLOCKADE_RISK" },
    "LEB-INV": { oil_impact: "+$0.80", gold_impact: "+$5", signal: "BORDER_SAD_ACT" }
  };

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        
        // Обновление истории для графиков
        setHistory(prev => {
          const newHistory = { ...prev };
          json.forEach(item => {
            if (!newHistory[item.id]) newHistory[item.id] = new Array(20).fill(item.prob);
            newHistory[item.id] = [...newHistory[item.id].slice(1), item.prob];
          });
          return newHistory;
        });

        // Динамика цен на нефть/золото в зависимости от среднего шанса угроз
        const avgProb = json.reduce((acc, curr) => acc + curr.prob, 0) / json.length;
        setPrices({
          brent: 75 + (avgProb * 0.4),
          gold: 1900 + (avgProb * 5)
        });
      }
    } catch (e) { console.error("UPLINK_LOST"); }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 5000);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '15px', color: '#00ff41', fontFamily: 'monospace' }}>
      
      {/* МАРКЕРЫ ЭНЕРГОНОСИТЕЛЕЙ */}
      <div style={{ border: '1px solid #1a1a1a', background: '#050505', padding: '10px 20px', marginBottom: '25px', display: 'flex', gap: '40px', fontSize: '12px' }}>
        <div>CRUDE_OIL_BRENT: <span style={{color:'#fff'}}>${prices.brent.toFixed(2)}</span> <span style={{fontSize:'10px', color: '#ff003c'}}>▲ VOLATILE</span></div>
        <div>XAU_GOLD_SPOT: <span style={{color:'#fff'}}>${prices.gold.toFixed(2)}</span> <span style={{fontSize:'10px', color: '#ff003c'}}>▲ RISK_OFF</span></div>
        <div style={{marginLeft: 'auto', color: '#444'}}>DATA_INTEGRITY: 100%</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
        {data.map(n => {
          const h = history[n.id] || [];
          const m = OSINT_METRICS[n.id] || {};
          const isRising = h[h.length-1] > h[0];

          return (
            <div key={n.id} style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '10px', color: '#58a6ff' }}>REGION_ID: {n.id}</span>
                <span style={{ fontSize: '10px', color: isRising ? '#ff003c' : '#00ff41' }}>
                  {isRising ? '▲ ESCALATING' : '▼ STABILIZING'}
                </span>
              </div>
              
              <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '20px' }}>{n.id.replace('-', ' ')}</h2>

              {/* ИСТОРИЧЕСКИЙ ГРАФИК (SVG) */}
              <div style={{ background: '#000', border: '1px solid #222', height: '80px', marginBottom: '20px', padding: '10px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke={isRising ? "#ff003c" : "#00ff41"}
                    strokeWidth="2"
                    points={h.map((p, i) => `${(i / (h.length - 1)) * 100},${100 - p}`).join(' ')}
                  />
                </svg>
                <div style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '8px', color: '#444' }}>24H_HISTORY_STREAM</div>
              </div>

              {/* ДАННЫЕ ИЗ ОСИНТ */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div style={{ background: '#0a0a0a', padding: '10px', border: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '8px', color: '#666' }}>ENERGY_CORRELATION</div>
                  <div style={{ fontSize: '12px', color: '#fff' }}>{m.oil_impact} / Brent</div>
                </div>
                <div style={{ background: '#0a0a0a', padding: '10px', border: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '8px', color: '#666' }}>OSINT_SIGNAL</div>
                  <div style={{ fontSize: '12px', color: '#fff' }}>{m.signal}</div>
                </div>
              </div>

              {/* ТЕКУЩИЙ ШАНС */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                 <div>
                    <div style={{ fontSize: '8px', color: '#666' }}>PROBABILITY</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>{n.prob}%</div>
                 </div>
                 <div style={{ textAlign: 'right', fontSize: '10px', color: '#444' }}>
                    UPDATED: {new Date().toLocaleTimeString()}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
