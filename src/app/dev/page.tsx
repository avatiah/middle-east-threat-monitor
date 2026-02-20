'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatDevSandbox() {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<Record<string, number[]>>({});
  const [prices, setPrices] = useState({ brent: 84.20, gold: 2045.10 });
  const [now, setNow] = useState(Date.now());
  const [lang, setLang] = useState<'EN' | 'RU'>('EN');

  // OSINT-ДАННЫЕ: КРИТИЧЕСКИЕ СИГНАЛЫ ЭСКАЛАЦИИ
  const OSINT: any = {
    "ISR-IRN": { s: "ELINT_SPIKE", d: "Радиоперехват: РЛС ПВО Ирана в боевом режиме.", oil: "+$2.40" },
    "USA-STRIKE": { s: "B-52_READY", d: "Страт. авиация США переведена на 24/7 готовность.", oil: "+$4.15" },
    "HORMUZ": { s: "SWARM_PATROL", d: "Катера КСИР блокируют гражданские коридоры.", oil: "+$12.80" },
    "LEB-INV": { s: "98th_DIV_MOV", d: "Элитные подразделения ЦАХАЛ выдвинуты к границе.", oil: "+$0.90" }
  };

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        setHistory(prev => {
          const newH = { ...prev };
          json.forEach(item => {
            if (!newH[item.id]) newH[item.id] = new Array(20).fill(item.prob);
            newH[item.id] = [...newH[item.id].slice(1), item.prob];
          });
          return newH;
        });
        const avg = json.reduce((acc, c) => acc + c.prob, 0) / json.length;
        setPrices({ brent: 75 + (avg * 0.4), gold: 1900 + (avg * 5) });
      }
    } catch (e) { console.error("UPLINK_FAIL"); }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 4000);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  const getProb = (n: any, type: 'short' | 'long') => {
    const base = n.prob || 0;
    return type === 'short' ? base : Math.round(base * 1.6);
  };

  const UI = {
    EN: { title: "THREAT_ENGINE // ANALYTICAL_DEV_V2", brent: "BRENT_CRUDE", gold: "GOLD_XAU", osint: "CRITICAL_OSINT_SIGNALS:", near: "BY FEB 28", far: "BY MAR 31" },
    RU: { title: "СИСТЕМА_УГРОЗ // АНАЛИТИКА_V2", brent: "НЕФТЬ_BRENT", gold: "ЗОЛОТО_XAU", osint: "СИГНАЛЫ_РАЗВЕДКИ:", near: "ДО 28 ФЕВ", far: "ДО 31 МАР" }
  };
  const T = UI[lang];

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '15px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* ВЕРХНЯЯ ПАНЕЛЬ С ЦЕНАМИ */}
        <header style={{ borderBottom: '1px solid #00ff41', paddingBottom: '15px', marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h1 style={{ color: '#00ff41', margin: 0, fontSize: '18px' }}>{T.title}</h1>
            <button onClick={() => setLang(lang === 'EN' ? 'RU' : 'EN')} style={{ background: '#111', border: '1px solid #00ff41', color: '#00ff41', padding: '4px 12px', fontSize: '10px', cursor: 'pointer' }}>
              {lang === 'EN' ? 'РУССКИЙ' : 'ENGLISH'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '30px', fontSize: '11px', color: '#8b949e' }}>
             <div>{T.brent}: <span style={{color: '#fff'}}>${prices.brent.toFixed(2)}</span> <span style={{color:'#ff003c'}}>▲</span></div>
             <div>{T.gold}: <span style={{color: '#fff'}}>${prices.gold.toFixed(2)}</span> <span style={{color:'#ff003c'}}>▲</span></div>
             <div style={{marginLeft: 'auto'}}>{new Date(now).toLocaleTimeString()} // SYNC_ACTIVE</div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {data.map(n => {
            const h = history[n.id] || [];
            const intel = OSINT[n.id] || {};
            const isRising = h[h.length - 1] > h[0];

            return (
              <div key={n.id} style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '20px' }}>
                <div style={{ fontSize: '9px', color: '#58a6ff', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>MARKET_ID: {n.id}</span>
                  <span style={{ color: isRising ? '#ff003c' : '#00ff41' }}>{isRising ? '▲ ESCALATING' : '▼ STABLE'}</span>
                </div>
                <h2 style={{ fontSize: '16px', color: '#fff', marginBottom: '15px' }}>{n.id.replace('-', ' ')}</h2>

                {/* ДИНАМИЧЕСКИЙ ГРАФИК */}
                <div style={{ height: '40px', background: '#000', border: '1px solid #111', marginBottom: '20px', position: 'relative' }}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline fill="none" stroke={isRising ? "#ff003c" : "#3b82f6"} strokeWidth="2" points={h.map((p, i) => `${(i / (h.length - 1)) * 100},${100 - p}`).join(' ')} />
                  </svg>
                </div>

                {/* СТАВКИ */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
                  <div style={{ flex: 1, background: '#000', padding: '15px', border: '1px solid #1a1a1a', textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#666', marginBottom: '8px' }}>{T.near}</div>
                    <div style={{ fontSize: '28px', color: '#3b82f6', fontWeight: 'bold' }}>{getProb(n, 'short')}%</div>
                  </div>
                  <div style={{ flex: 1, background: '#000', padding: '15px', border: '1px solid #1a1a1a', textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#666', marginBottom: '8px' }}>{T.far}</div>
                    <div style={{ fontSize: '28px', color: '#ff003c', fontWeight: 'bold' }}>{getProb(n, 'long')}%</div>
                  </div>
                </div>

                {/* КРИТИЧЕСКИЙ OSINT (Новый блок) */}
                <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '15px', marginBottom: '15px' }}>
                  <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '10px', fontWeight: 'bold' }}>{T.osint}</div>
                  <div style={{ background: '#0a0a0a', padding: '10px', borderLeft: '2px solid #ff003c' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{color: '#fff', fontWeight: 'bold'}}>{intel.s}</span>
                      <span style={{color: '#ff003c'}}>{intel.oil} BRENT_IMPACT</span>
                    </div>
                    <div style={{ fontSize: '9px', color: '#666' }}>{intel.d}</div>
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
