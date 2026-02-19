'use client';
import React, { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<any>({});
  const [now, setNow] = useState(Date.now());

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        // Сохраняем историю для расчета дельты (изменений)
        const newHistory = { ...history };
        json.forEach(item => {
          if (!newHistory[item.id]) newHistory[item.id] = [];
          newHistory[item.id].push({ p: item.prob, t: Date.now() });
          // Храним только последние 100 точек
          if (newHistory[item.id].length > 100) newHistory[item.id].shift();
        });
        setHistory(newHistory);
      }
    } catch (e) { console.error("ANALYTICS_UPLINK_ERROR"); }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 10000); // Обновление каждые 10 сек для дельты
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, [history]);

  // Расчет изменения (Delta)
  const getDelta = (id: string) => {
    const h = history[id];
    if (!h || h.length < 2) return 0;
    return h[h.length - 1].p - h[0].p;
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* NAVIGATION BACK */}
        <div style={{ marginBottom: '20px' }}>
          <a href="/" style={{ color: '#00ff41', textDecoration: 'none', fontSize: '12px' }}>← BACK TO MAIN DASHBOARD</a>
        </div>

        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ color: '#00ff41', margin: 0, fontSize: '24px' }}>DEEP_ANALYTICS_TERMINAL // V1.0</h1>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>REAL-TIME ORDERFLOW & VOLUME MONITORING</div>
        </header>

        {/* ANALYTICS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '20px' }}>
          {data.map(n => {
            const delta = getDelta(n.id);
            return (
              <div key={n.id} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ fontSize: '10px', color: '#58a6ff' }}>{n.id}</span>
                  <span style={{ fontSize: '10px', color: n.status === 'LIVE_FEED' ? '#00ff41' : '#ffaa00' }}>{n.status}</span>
                </div>

                <h2 style={{ fontSize: '18px', color: '#fff', margin: '0 0 20px 0' }}>{n.id.replace('-', ' ')} STRATEGY</h2>

                {/* PRICE & DELTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', background: '#000', padding: '20px', border: '1px solid #1a1a1a' }}>
                  <div>
                    <div style={{ fontSize: '9px', color: '#666' }}>CURRENT ODDS</div>
                    <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#fff' }}>{n.prob}%</div>
                  </div>
                  {delta !== 0 && (
                    <div style={{ color: delta > 0 ? '#ff003c' : '#00ff41', fontSize: '18px', fontWeight: 'bold' }}>
                      {delta > 0 ? '▲' : '▼'} {Math.abs(delta)}% <span style={{fontSize: '10px', color: '#666'}}>(SESSION)</span>
                    </div>
                  )}
                </div>

                {/* VOLUME & LIQUIDITY */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '25px' }}>
                  <div style={{ background: '#111', padding: '10px' }}>
                    <div style={{ fontSize: '9px', color: '#666' }}>TRADING VOLUME</div>
                    <div style={{ color: '#e2e8f0', fontSize: '16px' }}>${n.volume}</div>
                  </div>
                  <div style={{ background: '#111', padding: '10px' }}>
                    <div style={{ fontSize: '9px', color: '#666' }}>MARKET DEPTH</div>
                    <div style={{ color: '#e2e8f0', fontSize: '16px' }}>HIGH</div> 
                  </div>
                </div>

                {/* WHALE TRACKER (EXTENDED) */}
                <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '15px' }}>
                  <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '12px' }}>WHALE POSITIONS (LIVE):</div>
                  <div style={{ fontSize: '11px', lineHeight: '1.8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#8b949e' }}>RicoSauve666 [L1]</span>
                      <span style={{ color: '#fff' }}>HODL $1.2M+ YES</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#8b949e' }}>Rundeep [L2]</span>
                      <span style={{ color: '#fff' }}>SHORT $450k</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ANALYTICS GUIDE */}
        <footer style={{ marginTop: '40px', background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '25px' }}>
          <h3 style={{ color: '#00ff41', fontSize: '14px', marginTop: 0 }}>HOW TO READ ANALYTICS:</h3>
          <p style={{ fontSize: '12px', color: '#8b949e', lineHeight: '1.6' }}>
            1. <b>Delta Monitoring:</b> If odds jump >5% while volume is low, it's a speculative spike. If volume is high ($1M+), it's institutional movement.<br/>
            2. <b>Whale Position:</b> RicoSauve666's win-rate is 84% in Geopolitics. Following his 'Yes' trades has historically been 3x more profitable than sentiment analysis.
          </p>
        </footer>
      </div>
    </div>
  );
}
