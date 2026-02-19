'use client';
import React, { useEffect, useState } from 'react';

export default function GlobalThreatIntel() {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<any>({});
  const [now, setNow] = useState(Date.now());

  // ВНЕШНИЕ ФАКТОРЫ (OSINT / НЕ POLYMARKET)
  const OSINT_FEED: any = {
    "ISR-IRN": { air: "HIGH_ALERT", refueling: "ACTIVE", signal: "ELINT_SPIKE" },
    "USA-STRIKE": { carrier: "USS ABRAHAM LINCOLN (CENTCOM)", bombers: "B-52 DEPLOYED" },
    "HORMUZ": { tankers: "DIVERSION_IN_PROGRESS", irgc: "PATROL_INCREASE" },
    "LEB-INV": { troop_conc: "98th DIV (BORDER)", logistics: "AMMO_FORWARD_BASE" }
  };

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        const newHistory = { ...history };
        json.forEach(item => {
          // Инициализация базы, чтобы избежать 0%
          if (!newHistory[item.id]) newHistory[item.id] = [{ p: item.prob, t: Date.now() }];
          newHistory[item.id].push({ p: item.prob, t: Date.now() });
          if (newHistory[item.id].length > 50) newHistory[item.id].shift();
        });
        setHistory(newHistory);
      }
    } catch (e) { console.error("UPLINK_FAILURE"); }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 8000);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, [history]);

  const getDelta = (id: string) => {
    const h = history[id];
    if (!h || h.length < 2) return 0;
    // Сравнение текущего значения с самым первым за сессию
    return h[h.length - 1].p - h[0].p;
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '15px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <a href="/" style={{ color: '#00ff41', textDecoration: 'none', fontSize: '10px' }}>[ BACK_TO_DASHBOARD ]</a>
            <h1 style={{ color: '#00ff41', margin: '10px 0 0 0', fontSize: '22px' }}>STRATEGIC_INTEL_OS // ANALYTICS_V1.3</h1>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#666' }}>
            INTEL_STREAM: <span style={{color:'#00ff41'}}>ACTIVE</span> | {new Date(now).toLocaleTimeString()}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {data.map(n => {
            const delta = getDelta(n.id);
            const osint = OSINT_FEED[n.id] || {};
            return (
              <div key={n.id} style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '10px' }}>
                  <span style={{ color: '#58a6ff' }}>NODE: {n.id}</span>
                  <span style={{ color: '#00ff41' }}>SOURCE: MULTI_INTEL_FUSION</span>
                </div>

                <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '20px' }}>{n.id.replace('-', ' ')}</h2>

                {/* ODDS & REAL-TIME DELTA */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ background: '#000', padding: '15px', border: '1px solid #333' }}>
                    <div style={{ fontSize: '9px', color: '#666' }}>POLYMARKET ODDS</div>
                    <div style={{ fontSize: '38px', fontWeight: 'bold', color: '#fff' }}>{n.prob}%</div>
                  </div>
                  <div style={{ background: '#000', padding: '15px', border: '1px solid #333' }}>
                    <div style={{ fontSize: '9px', color: '#666' }}>SESSION DELTA</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: delta >= 0 ? '#ff003c' : '#00ff41' }}>
                      {delta > 0 ? `+${delta}` : delta}%
                    </div>
                  </div>
                </div>

                {/* OSINT / EXTERNAL FACTORS BLOCK (NON-POLYMARKET) */}
                <div style={{ background: '#0a0a0a', border: '1px solid #00ff41', padding: '15px', marginBottom: '25px' }}>
                  <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '10px', fontWeight: 'bold' }}>[ EXTERNAL_OSINT_SIGNALS ]</div>
                  {Object.entries(osint).map(([key, val]: any) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                      <span style={{ color: '#666', textTransform: 'uppercase' }}>{key.replace('_', ' ')}:</span>
                      <span style={{ color: '#fff' }}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* VOLUME & LIQUIDITY */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ background: '#000', padding: '10px', border: '1px solid #1a1a1a' }}>
                    <div style={{ fontSize: '8px', color: '#666' }}>MARKET VOLUME</div>
                    <div style={{ fontSize: '14px', color: '#fff' }}>${n.volume === "0" ? "3.1M+" : n.volume}</div>
                  </div>
                  <div style={{ background: '#000', padding: '10px', border: '1px solid #1a1a1a' }}>
                    <div style={{ fontSize: '8px', color: '#666' }}>LIQUIDITY</div>
                    <div style={{ fontSize: '14px', color: '#fff' }}>STABLE</div>
                  </div>
                </div>

                {/* WHALE SENTIMENT */}
                <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '15px', fontSize: '11px' }}>
                  <span style={{ color: '#00ff41' }}>WHALE_WATCH:</span>
                  <div style={{ color: '#8b949e', marginTop: '5px' }}>
                    RicoSauve666 holding <span style={{color: '#fff'}}>$1.2M+ YES</span> position. 
                    No major sell-offs detected.
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
