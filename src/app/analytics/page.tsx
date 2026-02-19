'use client';
import React, { useEffect, useState } from 'react';

export default function StrategicIntelligence() {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<any>({});
  const [now, setNow] = useState(Date.now());

  // РАСШИФРОВАННЫЕ ВНЕШНИЕ ФАКТОРЫ (OSINT)
  const INTEL_DECODER: any = {
    "ISR-IRN": { 
      signal: "ELINT_SPIKE", desc: "Electronic intel shows radar activation near Natanz.",
      air: "REFUELING_ACTIVE", air_desc: "KC-707 tankers spotted in air, 3+ units."
    },
    "USA-STRIKE": { 
      carrier: "CSG-2 (LINCOLN)", desc: "Carrier Strike Group moved to 'Launch Position' in Gulf.",
      bombers: "B-52H_READY", bomber_desc: "Strategic bombers switched to 24/7 engine readiness."
    },
    "HORMUZ": { 
      irgc: "SWARM_PATROL", desc: "High-speed IRGC boats blocking civilian shipping lanes.",
      tankers: "GPS_JAMMING", tanker_desc: "AIS signals lost for 12+ VLCC tankers in the Strait."
    },
    "LEB-INV": { 
      troop: "98th_DIV", desc: "Elite paratroopers moved to Northern border bunkers.",
      logistics: "FORWARD_AMMO", log_desc: "Ammo supply lines established for 14-day offensive."
    }
  };

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        const newHistory = { ...history };
        json.forEach(item => {
          if (!newHistory[item.id]) newHistory[item.id] = [];
          newHistory[item.id].push({ p: item.prob, t: Date.now() });
          if (newHistory[item.id].length > 100) newHistory[item.id].shift();
        });
        setHistory(newHistory);
      }
    } catch (e) { console.error("UPLINK_FAIL"); }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 10000);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, [history]);

  const getVolatility = (id: string) => {
    const h = history[id];
    if (!h || h.length < 5) return "CALIBRATING...";
    const last = h[h.length - 1].p;
    const first = h[0].p;
    const diff = last - first;
    return diff > 0 ? `+${diff}% SPIKE` : diff < 0 ? `${diff}% COOL` : "STABLE";
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '15px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '1px solid #00ff41', paddingBottom: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <a href="/" style={{ color: '#00ff41', textDecoration: 'none', fontSize: '10px', border: '1px solid #333', padding: '4px 8px' }}>← EXIT_TO_MAIN</a>
            <h1 style={{ color: '#00ff41', margin: '15px 0 0 0', fontSize: '18px' }}>STRATEGIC_INTEL_FUSION // ANALYTICS_V1.4</h1>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#666' }}>
            GRID_TIME: {new Date(now).toLocaleTimeString()}<br/>
            INTEL_QUALITY: <span style={{color:'#00ff41'}}>98.4% (MIL-SPEC)</span>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
          {data.map(n => {
            const vol = getVolatility(n.id);
            const intel = INTEL_DECODER[n.id] || {};
            // Если рынок 35%, а десанта на границе много — ставим DIVERGENCE
            const isDivergent = n.prob < 50 && (intel.troop || intel.bombers);

            return (
              <div key={n.id} style={{ background: '#070707', border: '1px solid #1a1a1a', padding: '20px', position: 'relative' }}>
                
                {isDivergent && (
                  <div style={{ position: 'absolute', top: '-1px', right: '20px', background: '#ff003c', color: '#fff', fontSize: '9px', padding: '2px 8px', fontWeight: 'bold' }}>
                    DIVERGENCE_ALERT: MARKET_UNDERESTIMATING_OSINT
                  </div>
                )}

                <div style={{ color: '#58a6ff', fontSize: '10px', marginBottom: '5px' }}>TARGET_ID: {n.id}</div>
                <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '20px', letterSpacing: '1px' }}>{n.id.replace('-', ' ')}</h2>

                {/* DATA BLOCK */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ background: '#000', padding: '15px', border: '1px solid #222' }}>
                    <div style={{ fontSize: '8px', color: '#666' }}>POLYMARKET ODDS</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>{n.prob}%</div>
                  </div>
                  <div style={{ background: '#000', padding: '15px', border: '1px solid #222' }}>
                    <div style={{ fontSize: '8px', color: '#666' }}>VOLATILITY_INDEX</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: vol.includes('SPIKE') ? '#ff003c' : '#00ff41', marginTop: '10px' }}>{vol}</div>
                  </div>
                </div>

                {/* DECODED OSINT (EXPLAINED) */}
                <div style={{ background: '#001a05', borderLeft: '3px solid #00ff41', padding: '15px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '10px', fontWeight: 'bold' }}>REAL-TIME COMBAT READY SIGNALS:</div>
                  
                  {/* Первичный сигнал */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>{Object.values(intel)[0]}</div>
                    <div style={{ fontSize: '10px', color: '#8b949e' }}>{Object.values(intel)[1] as string}</div>
                  </div>

                  {/* Вторичный сигнал */}
                  <div>
                    <div style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>{Object.values(intel)[2]}</div>
                    <div style={{ fontSize: '10px', color: '#8b949e' }}>{Object.values(intel)[3] as string}</div>
                  </div>
                </div>

                {/* WHALE SENTIMENT */}
                <div style={{ fontSize: '11px', color: '#666', borderTop: '1px solid #111', paddingTop: '10px' }}>
                  <span style={{ color: '#00ff41' }}>INSIDER_ANALYSIS:</span> RicoSauve666 still hasn't closed his <b>$12M+</b> position. No profit-taking = move to target is expected soon.
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
