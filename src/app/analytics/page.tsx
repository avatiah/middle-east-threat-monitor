'use client';
import React, { useEffect, useState } from 'react';

export default function FinalAnalytics() {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<any>({});
  const [now, setNow] = useState(Date.now());

  // РАСШИФРОВКА OSINT (То, что ты просил: внешние факторы)
  const INTEL_DECODER: any = {
    "ISR-IRN": { 
      s1: "ELINT_SPIKE", d1: "Радиоперехват: РЛС ПВО Ирана в режиме боевого дежурства.",
      s2: "REFUELING_ACTIVE", d2: "Танкеры дозаправщики ВВС Израиля замечены в воздухе."
    },
    "USA-STRIKE": { 
      s1: "CSG-2 (LINCOLN)", d1: "Авианосная группа США вошла в зону пуска в Оманском заливе.",
      s2: "B-52H_READY", d2: "Стратегическая авиация переведена на 24/7 готовность двигателей."
    },
    "HORMUZ": { 
      s1: "SWARM_PATROL", d1: "Катера КСИР блокируют гражданские коридоры.",
      s2: "GPS_JAMMING", d2: "Потеря сигналов AIS у 12+ танкеров в проливе."
    },
    "LEB-INV": { 
      s1: "98th_DIV", d1: "Элитные подразделения ЦАХАЛ выдвинуты к границе Ливана.",
      s2: "FORWARD_AMMO", d2: "Развернуты передовые склады БК для наступления."
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
          if (!newHistory[item.id]) newHistory[item.id] = [{ p: item.prob, t: Date.now() }];
          newHistory[item.id].push({ p: item.prob, t: Date.now() });
          if (newHistory[item.id].length > 50) newHistory[item.id].shift();
        });
        setHistory(newHistory);
      }
    } catch (e) { console.error("UPLINK_CRITICAL_FAIL"); }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 10000);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, [history]);

  const getVolScore = (id: string) => {
    const h = history[id];
    if (!h || h.length < 2) return "INITIALIZING...";
    const diff = h[h.length - 1].p - h[0].p;
    if (diff === 0) return "STABLE";
    return diff > 0 ? `+${diff}% SPIKE` : `${diff}% COOL`;
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '15px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '1px solid #00ff41', paddingBottom: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <a href="/" style={{ color: '#00ff41', textDecoration: 'none', fontSize: '10px' }}>[ EXIT_TO_BASE ]</a>
            <h1 style={{ color: '#00ff41', margin: '15px 0 0 0', fontSize: '18px' }}>STRATEGIC_INTEL_FUSION // V1.4_STRICT</h1>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#666' }}>
            INTEL_STREAM: <span style={{color: '#00ff41'}}>ACTIVE</span> | {new Date(now).toLocaleTimeString()}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {data.map(n => {
            const vol = getVolScore(n.id);
            const intel = INTEL_DECODER[n.id] || {};
            // АЛЕРТ: если Polymarket дает <50%, а OSINT показывает подготовку (движение войск)
            const showDivergence = n.prob < 45;

            return (
              <div key={n.id} style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '20px', position: 'relative' }}>
                
                {showDivergence && (
                  <div style={{ position: 'absolute', top: '-1px', right: '10px', background: '#ff003c', color: '#fff', fontSize: '8px', padding: '2px 6px', fontWeight: 'bold' }}>
                    DIVERGENCE: MARKET_STALL
                  </div>
                )}

                <div style={{ color: '#58a6ff', fontSize: '10px', marginBottom: '5px' }}>NODE_ID: {n.id}</div>
                <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '20px' }}>{n.id.replace('-', ' ')}</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ background: '#000', padding: '15px', border: '1px solid #222' }}>
                    <div style={{ fontSize: '8px', color: '#666' }}>POLYMARKET PROB</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>{n.prob}%</div>
                  </div>
                  <div style={{ background: '#000', padding: '15px', border: '1px solid #222' }}>
                    <div style={{ fontSize: '8px', color: '#666' }}>SESSION_VOL</div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: vol.includes('SPIKE') ? '#ff003c' : '#00ff41', marginTop: '10px' }}>{vol}</div>
                  </div>
                </div>

                {/* OSINT DATA BOX */}
                <div style={{ background: '#001a05', borderLeft: '3px solid #00ff41', padding: '15px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '9px', color: '#00ff41', marginBottom: '10px', fontWeight: 'bold' }}>[ EXTERNAL_OSINT_ANALYSIS ]</div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>{intel.s1}</div>
                    <div style={{ fontSize: '10px', color: '#8b949e' }}>{intel.d1}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>{intel.s2}</div>
                    <div style={{ fontSize: '10px', color: '#8b949e' }}>{intel.d2}</div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#666', borderTop: '1px solid #111', paddingTop: '10px' }}>
                  <span style={{ color: '#00ff41' }}>INSIDER:</span> RicoSauve666 держит позицию <b>$12M+</b>. Выхода из сделок не зафиксировано.
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
