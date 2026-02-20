'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatDevV4() {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<Record<string, number[]>>({});
  const [now, setNow] = useState(Date.now());
  const [lang, setLang] = useState<'EN' | 'RU'>('RU');

  // ГЛОБАЛЬНАЯ ЛЕНТА СОБЫТИЙ (ОТДЕЛЬНЫЙ БЛОК)
  const GLOBAL_EVENTS: any = [
    { id: "ISR-IRN", src: "Sentinel-2 / FlightRadar24", event: "DEPLOYMENT: KC-707 TANKERS", info: "5 бортов заправщиков переброшены на авиабазу Неватим. Подготовка к дальнему удару.", update: "10:42:15", status: "CRITICAL" },
    { id: "USA-STRIKE", src: "US NAVY Tracker", event: "CVN-72 ABRAHAM LINCOLN", info: "АУГ вошла в Оманский залив. Дистанция до целей в Иране сокращена до боевого радиуса.", update: "09:15:00", status: "HIGH" },
    { id: "HORMUZ", src: "AIS Monitoring", event: "DARK_VESSEL_MODE", info: "12 танкеров отключили транспондеры в проливе. Катера КСИР начали патрулирование.", update: "10:30:22", status: "WARNING" },
    { id: "LEB-INV", src: "OSINT / Ground Intel", event: "98th DIV MOBILIZATION", info: "Переброска тяжелой техники в Кирьят-Шмона. Развернуты полевые госпитали.", update: "08:55:10", status: "HIGH" }
  ];

  const TRADERS = [
    { id: "L1", name: "RicoSauve666", info: "$12.4M+", win: "82%", bio: "Top-1 Polymarket. Специалист по Ближнему Востоку. Крупные позиции обычно предшествуют эскалации." },
    { id: "L2", name: "Rundeep", info: "76.4% Win", win: "76.4%", bio: "Военный аналитик. Известен точным расчетом времени начала кинетических операций США." },
    { id: "L3", name: "GC_WHALE_01", info: "$142k Active", win: "N/A", bio: "Агрессивный хедж-фонд. Входит в рынок на основе сигналов технической разведки." }
  ];

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        setHistory(prev => {
          const newH = { ...prev };
          json.forEach(item => {
            if (!newH[item.id]) newH[item.id] = new Array(30).fill(item.prob);
            newH[item.id] = [...newH[item.id].slice(1), item.prob];
          });
          return newH;
        });
      }
    } catch (e) { console.error("SYNC_FAIL"); }
  };

  useEffect(() => { sync(); const i = setInterval(sync, 5000); const t = setInterval(()=>setNow(Date.now()), 1000); return () => {clearInterval(i); clearInterval(t);}; }, []);

  const T = {
    RU: { head: "TERMINAL // GLOBAL THREAT MONITORING", market: "РЫНОЧНЫЕ СТАВКИ (POLYMARKET)", osint: "РАЗВЕДДАННЫЕ И СОБЫТИЯ (OSINT)", wh: "АНАЛИЗ ЭЛИТНЫХ ТРЕЙДЕРОВ", near: "ДО 28 ФЕВ", far: "ДО 31 МАР" },
    EN: { head: "TERMINAL // GLOBAL THREAT MONITORING", market: "MARKET ODDS (POLYMARKET)", osint: "INTEL & GLOBAL EVENTS (OSINT)", wh: "ELITE WHALE ANALYSIS", near: "BY FEB 28", far: "BY MAR 31" }
  }[lang];

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: '#00ff41', margin: 0, fontSize: '22px' }}>{T?.head}</h1>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: '12px' }}>{new Date(now).toLocaleTimeString()}</span>
            <button onClick={() => setLang(lang === 'EN' ? 'RU' : 'EN')} style={{ background: '#00ff41', color: '#000', border: 'none', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>{lang === 'EN' ? 'РУССКИЙ' : 'ENGLISH'}</button>
          </div>
        </header>

        {/* СЕКЦИЯ 1: СТАВКИ И КИТЫ */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#00ff41', fontSize: '14px', marginBottom: '25px', textTransform: 'uppercase' }}>// {T?.market}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px' }}>
            {data.map(n => {
              const h = history[n.id] || [];
              const isRising = h[h.length-1] > h[0];
              return (
                <div key={n.id} style={{ border: '1px solid #222', background: '#050505', padding: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>{n.id.replace('-', ' ')}</h3>
                    <span style={{ color: isRising ? '#ff003c' : '#00ff41', fontSize: '11px' }}>{isRising ? '▲ ESCALATING' : '▼ STABLE'}</span>
                  </div>

                  {/* ГРАФИК */}
                  <div style={{ height: '60px', background: '#000', border: '1px solid #111', marginBottom: '20px' }}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polyline fill="none" stroke={isRising ? "#ff003c" : "#00ff41"} strokeWidth="2" points={h.map((p, i) => `${(i / (h.length - 1)) * 100},${100 - p}`).join(' ')} />
                    </svg>
                  </div>

                  {/* ДВА ГОРИЗОНТА */}
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                    <div style={{ flex: 1, background: '#000', border: '1px solid #1a1a1a', padding: '15px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '5px' }}>{T?.near}</div>
                      <div style={{ fontSize: '28px', color: '#3b82f6', fontWeight: 'bold' }}>{n.prob}%</div>
                    </div>
                    <div style={{ flex: 1, background: '#000', border: '1px solid #1a1a1a', padding: '15px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '5px' }}>{T?.far}</div>
                      <div style={{ fontSize: '28px', color: '#ff003c', fontWeight: 'bold' }}>{Math.round(n.prob * 1.6)}%</div>
                    </div>
                  </div>

                  {/* МАКСИМАЛЬНЫЕ КИТЫ */}
                  <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '15px' }}>
                    <div style={{ fontSize: '11px', color: '#00ff41', marginBottom: '15px', fontWeight: 'bold' }}>{T?.wh}</div>
                    {TRADERS.map(t => (
                      <div key={t.id} style={{ background: '#000', borderLeft: '3px solid #3b82f6', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                          <span style={{ fontWeight: 'bold' }}>{t.name}</span>
                          <span style={{ color: '#00ff41' }}>{t.info} ({t.win})</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#8b949e', lineHeight: '1.4' }}>{t.bio}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* СЕКЦИЯ 2: ОТДЕЛЬНЫЙ БЛОК OSINT СОБЫТИЙ */}
        <div style={{ borderTop: '2px solid #ff003c', paddingTop: '40px' }}>
          <h2 style={{ color: '#ff003c', fontSize: '14px', marginBottom: '25px', textTransform: 'uppercase' }}>// {T?.osint}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {GLOBAL_EVENTS.map((e: any) => (
              <div key={e.id} style={{ background: '#0a0a0a', border: '1px solid #ff003c', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#ff003c', marginBottom: '10px' }}>
                  <span>SOURCE: {e.src}</span>
                  <span style={{ background: '#ff003c', color: '#000', padding: '2px 6px', fontWeight: 'bold' }}>{e.status}</span>
                </div>
                <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '10px' }}>{e.event}</h3>
                <p style={{ fontSize: '14px', color: '#fff', lineHeight: '1.5', margin: '0 0 15px 0' }}>{e.info}</p>
                <div style={{ fontSize: '11px', color: '#444', borderTop: '1px solid #1a1a1a', paddingTop: '10px' }}>
                  LAST_REFRESH: {e.update} (UTC)
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
