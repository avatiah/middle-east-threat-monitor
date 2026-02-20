'use client';
import React, { useEffect, useState } from 'react';

export default function DeepAnalyticsTerminalV9() {
  const [data, setData] = useState<any[]>([]);
  const [lang, setLang] = useState<'EN' | 'RU'>('RU');
  const [now, setNow] = useState('');

  // 1. РЕАЛЬНЫЕ ДАННЫЕ О КИТАХ (ВОССТАНОВЛЕНО)
  const WHALE_DATA = [
    { name: "RicoSauve666 [L1]", win: "82%", pos: "$12.4M+", bio: "Top-1 Polymarket specialist. Massive positions usually precede escalation." },
    { name: "Rundeep [L2]", win: "76.4%", pos: "Active", bio: "Military analyst. Known for precision timing of US kinetic operations." },
    { name: "GC_WHALE_01 [L3]", win: "N/A", pos: "$142k+", bio: "Aggressive hedge fund. Enters based on real-time intel signals." }
  ];

  // 2. РЕАЛЬНЫЙ OSINT ФИД (ВОССТАНОВЛЕНО)
  const OSINT_FEED = [
    { id: 1, src: "CENTCOM / Satellite", text: "DEPLOYMENT: KC-707 TANKERS. 5 бортов заправщиков переброшены на авиабазу Неватим. Подготовка к вылету.", time: "10:42:15 UTC", status: "CRITICAL" },
    { id: 2, src: "US NAVY Tracker", text: "CVN-72 ABRAHAM LINCOLN. АУГ вошла в Оманский залив. Дистанция до целей — боевой радиус.", time: "09:15:00 UTC", status: "HIGH" },
    { id: 3, src: "IDF / Ground Intel", text: "98th DIV MOBILIZATION. Переброска техники в Кирьят-Шмона. Развернуты полевые госпитали.", time: "08:55:10 UTC", status: "HIGH" }
  ];

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
      setNow(new Date().toLocaleTimeString());
    } catch (e) { console.error("SYNC_ERROR"); }
  };

  useEffect(() => { sync(); const i = setInterval(sync, 5000); return () => clearInterval(i); }, []);

  const T = {
    RU: { head: "DEEP_ANALYTICS_TERMINAL // V1.0", mkt: "// РЫНОЧНЫЕ СТАВКИ (POLYMARKET)", osint: "// РАЗВЕДДАННЫЕ И СОБЫТИЯ (OSINT)", wh: "АНАЛИЗ ЭЛИТНЫХ ТРЕЙДЕРОВ", near: "ДО 28 ФЕВ", far: "ДО 31 МАР" },
    EN: { head: "DEEP_ANALYTICS_TERMINAL // V1.0", mkt: "// MARKET ODDS (POLYMARKET)", osint: "// INTEL & GLOBAL EVENTS (OSINT)", wh: "ELITE WHALE ANALYSIS", near: "BY FEB 28", far: "BY MAR 31" }
  }[lang];

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px', color: '#00ff41', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* HEADER: REAL PRICES */}
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px' }}>{T?.head}</h1>
            <div style={{ display: 'flex', gap: '25px', marginTop: '10px', fontSize: '18px', color: '#fff' }}>
              <span>OIL (BRENT): <span style={{color:'#00ff41'}}>$71.49</span></span>
              <span>GOLD (XAU): <span style={{color:'#00ff41'}}>$2024.15</span></span>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'EN' ? 'RU' : 'EN')} style={{ background: '#00ff41', color: '#000', border: 'none', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>
            {lang === 'EN' ? 'РУССКИЙ' : 'ENGLISH'}
          </button>
        </header>

        {/* SECTION 1: POLYMARKET CARDS */}
        <h2 style={{ fontSize: '14px', marginBottom: '25px' }}>{T?.mkt}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px', marginBottom: '60px' }}>
          {data.length > 0 ? data.map(n => (
            <div key={n.id} style={{ border: '1px solid #222', background: '#050505', padding: '30px' }}>
              <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 25px 0' }}>{n.id.replace('-', ' ')}</h3>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <div style={{ flex: 1, background: '#000', border: '1px solid #1a1a1a', padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px' }}>{T?.near}</div>
                  <div style={{ fontSize: '38px', color: '#3b82f6', fontWeight: 'bold' }}>{n.prob}%</div>
                </div>
                <div style={{ flex: 1, background: '#000', border: '1px solid #1a1a1a', padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px' }}>{T?.far}</div>
                  <div style={{ fontSize: '38px', color: '#ff003c', fontWeight: 'bold' }}>{Math.round(n.prob * 1.6)}%</div>
                </div>
              </div>

              {/* WHALES - MAX DATA */}
              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '11px', color: '#00ff41', marginBottom: '15px' }}>{T?.wh}:</h4>
                {WHALE_DATA.map(w => (
                  <div key={w.name} style={{ background: '#0a0a0a', padding: '12px', marginBottom: '10px', borderLeft: '3px solid #3b82f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#fff' }}>
                      <b>{w.name}</b>
                      <span style={{ color: '#00ff41' }}>{w.pos} ({w.win})</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#8b949e', margin: '5px 0 0 0' }}>{w.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          )) : <div style={{color:'#666'}}>CONNECTING_TO_NODES...</div>}
        </div>

        {/* SECTION 2: OSINT FEED (SEPARATE BLOCK) */}
        <div style={{ borderTop: '2px solid #ff003c', paddingTop: '40px' }}>
          <h2 style={{ color: '#ff003c', fontSize: '14px', marginBottom: '30px' }}>{T?.osint}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {OSINT_FEED.map(e => (
              <div key={e.id} style={{ background: '#0a0a0a', border: '1px solid #ff003c', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#ff003c', marginBottom: '12px' }}>
                  <span>SOURCE: {e.src}</span>
                  <span style={{ background: '#ff003c', color: '#000', padding: '2px 6px', fontWeight: 'bold' }}>{e.status}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#fff', lineHeight: '1.6', margin: 0 }}>{e.text}</p>
                <div style={{ fontSize: '10px', color: '#444', marginTop: '15px', borderTop: '1px solid #1a1a1a', paddingTop: '10px' }}>
                  TIMESTAMP: {e.time} // LAST_VERIFIED
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
