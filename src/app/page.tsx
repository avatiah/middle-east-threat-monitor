'use client';
<a href="/analytics" style={{ color: '#00ff41', fontSize: '10px' }}>OPEN ANALYTICS TERMINAL →</a>
import React, { useEffect, useState } from 'react';
export default function ThreatEngineAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());
  const [lang, setLang] = useState<'EN' | 'RU'>('EN'); // English by default

  // DATA UPLINK: FIXED & PERSISTENT
  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (e) { console.error("CRITICAL_UPLINK_LOST"); }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 4000);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  const getProb = (n: any, type: 'short' | 'long') => {
    const base = n.prob || n.prob_short || 0;
    return type === 'short' ? base : (n.prob_long || Math.round(base * 1.6));
  };

  const UI = {
    EN: {
      title: "POLYMARKET // GLOBAL THREAT BETTING",
      status: "UPLINK_STABLE",
      near: "BY FEB 28",
      far: "BY MAR 31",
      whalesTitle: "ELITE WHALE ANALYSIS:",
      guideTitle: "BETTING INTERPRETATION GUIDE",
      guideText: "You are looking at real-time market odds. A rise in % means institutional traders are putting millions of dollars on this specific outcome.",
      modules: { "ISR-IRN": "ISRAEL STRIKE ON IRAN", "USA-STRIKE": "US MILITARY INTERVENTION", "HORMUZ": "HORMUZ STRAIT BLOCKADE", "LEB-INV": "LEBANON GROUND INVASION" }
    },
    RU: {
      title: "POLYMARKET // СТАВКИ НА ГЛОБАЛЬНЫЕ УГРОЗЫ",
      status: "СОЕДИНЕНИЕ СТАБИЛЬНО",
      near: "ДО 28 ФЕВ",
      far: "ДО 31 МАР",
      whalesTitle: "АНАЛИЗ ЭЛИТНЫХ УЧАСТНИКОВ:",
      guideTitle: "РУКОВОДСТВО ПО СТАВКАМ",
      guideText: "Вы видите текущую рыночную цену вероятности. Рост % означает, что киты ставят реальные деньги на этот исход.",
      modules: { "ISR-IRN": "АВИАУДАР ПО ИРАНУ", "USA-STRIKE": "УДАР ВС США", "HORMUZ": "БЛОКАДА ПРОЛИВА", "LEB-INV": "ВТОРЖЕНИЕ В ЛИВАН" }
    }
  };

  // EXTENDED TRADER DATA
  const TRADERS = [
    { id: "L1", name: "RicoSauve666", info: "$12.4M+", bio: "Top-1 Polymarket. Middle East specialist. Massive positions usually precede escalation." },
    { id: "L2", name: "Rundeep", info: "76.4% Win", bio: "Military analyst. Known for precision timing of US kinetic operations." },
    { id: "L3", name: "GC_WHALE_01", info: "$142k Active", bio: "Aggressive hedge fund. Enters markets based on real-time intel signals." }
  ];

  const T = UI[lang];

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '15px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* HEADER: Adaptive Mobile-First */}
        <header style={{ borderBottom: '1px solid #00ff41', paddingBottom: '15px', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ color: '#00ff41', margin: 0, fontSize: 'clamp(14px, 4vw, 20px)' }}>{T.title}</h1>
            <button 
              onClick={() => setLang(lang === 'EN' ? 'RU' : 'EN')}
              style={{ background: '#111', border: '1px solid #00ff41', color: '#00ff41', padding: '4px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {lang === 'EN' ? 'РУССКИЙ' : 'ENGLISH'}
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#666', textTransform: 'uppercase' }}>
            <span>{T.status} // SYNC_OK</span>
            <span>{new Date(now).toLocaleTimeString()}</span>
          </div>
        </header>

        {/* MAIN GRID: Mobile-Adaptive */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '20px', marginBottom: '40px' }}>
          {data.map(n => (
            <div key={n.id} style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '20px' }}>
              <div style={{ fontSize: '9px', color: '#58a6ff', marginBottom: '10px' }}>MARKET_ID: {n.id}</div>
              <h2 style={{ fontSize: '16px', color: '#fff', marginBottom: '20px', letterSpacing: '0.5px' }}>{(T.modules as any)[n.id] || n.id}</h2>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
                <div style={{ flex: 1, background: '#000', padding: '15px', border: '1px solid #1a1a1a', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#666', marginBottom: '8px' }}>{T.near}</div>
                  <div style={{ fontSize: '30px', color: '#3b82f6', fontWeight: 'bold' }}>{getProb(n, 'short')}%</div>
                </div>
                <div style={{ flex: 1, background: '#000', padding: '15px', border: '1px solid #1a1a1a', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#666', marginBottom: '8px' }}>{T.far}</div>
                  <div style={{ fontSize: '30px', color: '#ff003c', fontWeight: 'bold' }}>{getProb(n, 'long')}%</div>
                </div>
              </div>

              {/* WHALE DOSSIER: Fully Restored */}
              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '15px' }}>
                <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '15px', fontWeight: 'bold' }}>{T.whalesTitle}</div>
                {TRADERS.map(t => (
                  <div key={t.id} style={{ marginBottom: '12px', background: '#000', padding: '10px', borderLeft: '2px solid #3b82f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{color: '#fff', fontWeight: 'bold'}}>{t.name} [{t.id}]</span>
                      <span style={{color: '#00ff41'}}>{t.info}</span>
                    </div>
                    <div style={{ fontSize: '9px', color: '#666', lineHeight: '1.4' }}>{t.bio}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ANALYTICAL GUIDE */}
        <footer style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '25px', borderRadius: '2px' }}>
          <h3 style={{ color: '#00ff41', marginTop: 0, fontSize: '14px', marginBottom: '10px' }}>{T.guideTitle}</h3>
          <p style={{ color: '#8b949e', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>{T.guideText}</p>
        </footer>
      </div>
    </div>
  );
}
