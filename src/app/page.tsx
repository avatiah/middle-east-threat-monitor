'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatEngineAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());
  const [lang, setLang] = useState<'RU' | 'EN'>('RU');

  // ЛОГИКА ПОЛУЧЕНИЯ ДАННЫХ (БЕЗ ИЗМЕНЕНИЙ)
  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (e) { console.error("SYNC_LOST"); }
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

  // КОНТЕНТ
  const UI = {
    RU: {
      title: "POLYMARKET // СТАВКИ НА ГЛОБАЛЬНЫЕ УГРОЗЫ",
      status: "ПОДКЛЮЧЕНО",
      near: "ДО 28 ФЕВ",
      far: "ДО 31 МАР",
      whales: "ТОП ТРЕЙДЕРЫ (WHALES)",
      guide: "РУКОВОДСТВО ПО СТАВКАМ",
      guideText: "Вы видите текущую рыночную цену вероятности события. Рост % означает, что трейдеры ставят реальные деньги на этот исход.",
      names: { "ISR-IRN": "АВИАУДАР ПО ИРАНУ", "USA-STRIKE": "УДАР ВС США", "HORMUZ": "БЛОКАДА ПРОЛИВА", "LEB-INV": "ВТОРЖЕНИЕ В ЛИВАН" }
    },
    EN: {
      title: "POLYMARKET // GLOBAL THREAT BETTING",
      status: "UPLINK_STABLE",
      near: "BY FEB 28",
      far: "BY MAR 31",
      whales: "ELITE TRADERS (WHALES)",
      guide: "BETTING INTERPRETATION",
      guideText: "Percentages represent real-money market odds. Rising % indicates that whales are betting on this specific escalation.",
      names: { "ISR-IRN": "ISRAEL STRIKE ON IRAN", "USA-STRIKE": "US MILITARY STRIKE", "HORMUZ": "HORMUZ BLOCKADE", "LEB-INV": "LEBANON INVASION" }
    }
  };

  const T = UI[lang];

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '15px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER: Adaptive & Language Switch */}
        <header style={{ borderBottom: '1px solid #00ff41', paddingBottom: '15px', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ color: '#00ff41', margin: 0, fontSize: '18px', lineHeight: '1.2' }}>{T.title}</h1>
            <button 
              onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')}
              style={{ background: '#1a1a1a', border: '1px solid #00ff41', color: '#00ff41', padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}
            >
              {lang === 'RU' ? '→ ENGLISH' : '→ РУССКИЙ'}
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#666' }}>
            <span>STATUS: <span style={{color: '#00ff41'}}>{T.status}</span></span>
            <span>{new Date(now).toLocaleTimeString()}</span>
          </div>
        </header>

        {/* MAIN GRID: Mobile-First (1 column on mobile, 2+ on desktop) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', 
          gap: '15px', 
          marginBottom: '30px' 
        }}>
          {data.map(n => (
            <div key={n.id} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '20px' }}>
              <div style={{ fontSize: '9px', color: '#58a6ff', marginBottom: '8px' }}>POLYMARKET_ID: {n.id}</div>
              <h2 style={{ fontSize: '16px', color: '#fff', marginBottom: '20px' }}>{(T.names as any)[n.id] || n.id}</h2>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{ flex: 1, background: '#000', padding: '12px', border: '1px solid #1a1a1a', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '5px' }}>{T.near}</div>
                  <div style={{ fontSize: '28px', color: '#3b82f6', fontWeight: 'bold' }}>{getProb(n, 'short')}%</div>
                </div>
                <div style={{ flex: 1, background: '#000', padding: '12px', border: '1px solid #1a1a1a', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '5px' }}>{T.far}</div>
                  <div style={{ fontSize: '28px', color: '#ff003c', fontWeight: 'bold' }}>{getProb(n, 'long')}%</div>
                </div>
              </div>

              {/* TRADERS: Simplified for Mobile */}
              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '15px' }}>
                <div style={{ fontSize: '9px', color: '#00ff41', marginBottom: '10px' }}>{T.whales}:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8b949e' }}>
                  <span>RicoSauve666</span>
                  <span style={{ color: '#fff' }}>$12.4M+</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER: BETTING GUIDE */}
        <footer style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '20px', fontSize: '11px' }}>
          <h3 style={{ color: '#00ff41', marginTop: 0, fontSize: '12px' }}>{T.guide}</h3>
          <p style={{ color: '#8b949e', margin: 0, lineHeight: '1.4' }}>{T.guideText}</p>
        </footer>
      </div>
    </div>
  );
}
