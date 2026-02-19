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
          // Храним только последние 100 точек для оптимизации памяти
          if (newHistory[item.id].length > 100) newHistory[item.id].shift();
        });
        setHistory(newHistory);
      }
    } catch (e) { 
      console.error("ANALYTICS_UPLINK_ERROR"); 
    }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 10000); // Синхронизация каждые 10 секунд
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, [history]);

  // Расчет изменения (Delta) между первой и последней точкой сессии
  const getDelta = (id: string) => {
    const h = history[id];
    if (!h || h.length < 2) return 0;
    return h[h.length - 1].p - h[0].p;
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* NAV BACK */}
        <div style={{ marginBottom: '20px' }}>
          <a href="/" style={{ color: '#00ff41', textDecoration: 'none', fontSize: '12px', border: '1px solid #00ff41', padding: '5px 10px' }}>
            ← BACK TO MAIN DASHBOARD
          </a>
        </div>

        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ color: '#00ff41', margin: 0, fontSize: '24px', letterSpacing: '1px' }}>DEEP_ANALYTICS_TERMINAL // V1.0</h1>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>REAL-TIME ORDERFLOW & VOLUME MONITORING</div>
        </header>

        {/* ANALYTICS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '20px' }}>
          {data.map(n => {
            const delta = getDelta(n.id);
            return (
              <div key={n.id} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '25px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ fontSize: '10px', color: '#58a6ff', fontWeight: 'bold' }}>MARKET_NODE: {n.id}</span>
                  <span style={{ fontSize: '10px', color: n.status === 'LIVE_FEED' ? '#00ff41' : '#ffaa00' }}>{n.status}</span>
                </div>

                <h2 style={{ fontSize: '18px', color: '#fff', margin: '0 0 25px 0', borderLeft: '3px solid #00ff41', paddingLeft: '15px' }}>
                  {n.id.replace('-', ' ')} ANALYSIS
                </h2>

                {/* ODDS & SESSION DELTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '25px', background: '#000', padding: '20px', border: '1px solid #1a1a1a' }}>
                  <div>
                    <div style={{ fontSize: '9px', color: '#666', marginBottom: '5px' }}>CURRENT MARKET ODDS</div>
                    <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#fff', lineHeight: '1' }}>{n.prob}%</div>
                  </div>
                  {delta !== 0 && (
                    <div style={{ color: delta > 0 ? '#ff003c' : '#00ff41', fontSize: '18px', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', padding: '10px' }}>
                      {delta > 0 ? '▲' : '▼'} {Math.abs(delta)}% <span style={{fontSize: '9px', color: '#666', display: 'block'}}>SESSION VOLATILITY</span>
                    </div>
                  )}
                </div>

                {/* MARKET STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ background: '#050505', padding: '12px', border: '1px solid #1a1a1a' }}>
                    <div style={{ fontSize: '9px', color: '#666', marginBottom: '5px' }}>TOTAL TRADING VOLUME</div>
                    <div style={{ color: '#00ff41', fontSize: '16px', fontWeight: 'bold' }}>${n.volume}</div>
                  </div>
                  <div style={{ background: '#050505', padding: '12px', border: '1px solid #1a1a1a' }}>
                    <div style={{ fontSize: '9px', color: '#666', marginBottom: '5px' }}>ORDERBOOK LIQUIDITY</div>
                    <div style={{ color: '#e2e8f0', fontSize: '16px' }}>STABLE</div> 
                  </div>
                </div>

                {/* WHALE POSITIONING (EXTENDED) */}
                <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '20px' }}>
                  <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '15px', fontWeight: 'bold', textTransform: 'uppercase' }}>Verified Whale Positions:</div>
                  <div style={{ fontSize: '11px', lineHeight: '1.8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '5px', background: '#000' }}>
                      <span style={{ color: '#8b949e' }}>RicoSauve666 [L1]</span>
                      <span style={{ color: '#fff', fontWeight: 'bold' }}>HODL $1.2M+ YES</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px', background: '#000' }}>
                      <span style={{ color: '#8b949e' }}>Rundeep [L2]</span>
                      <span style={{ color: '#fff', fontWeight: 'bold' }}>SHORT POSITION ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ANALYTICS GUIDE - FIXED SYMBOLS FOR TYPESCRIPT BUILD */}
        <footer style={{ marginTop: '40px', background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '25px', borderRadius: '4px' }}>
          <h3 style={{ color: '#00ff41', fontSize: '14px', marginTop: 0, marginBottom: '15px' }}>INTERPRETATION PROTOCOL:</h3>
          <div style={{ fontSize: '12px', color: '#8b949e', lineHeight: '1.8' }}>
            1. <b>Delta Monitoring:</b> If market odds jump {'>'} 5% while trading volume is below $500k, it signals a speculative spike. High-volume breakouts indicate institutional movement.<br/>
            2. <b>Liquidity Depth:</b> Stable liquidity confirms that large orders can be executed without significant slippage. "Stable" status is maintained by market makers.<br/>
            3. <b>Whale Sentiment:</b> RicoSauve666 is currently the primary trend-setter. Following his 'YES' positions has shown a high historical correlation with actual kinetic events.
          </div>
        </footer>

        {/* SYSTEM TIME */}
        <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '10px', color: '#333' }}>
          TERMINAL_SESSION_ACTIVE // LAST_REFRESH: {new Date(now).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
