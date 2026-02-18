'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatEngineAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  const sync = async () => {
    const res = await fetch('/api/threats');
    const json = await res.json();
    if (Array.isArray(json)) setData(json);
  };

  useEffect(() => { 
    sync(); 
    setInterval(sync, 4000); 
    setInterval(() => setNow(Date.now()), 1000);
  }, []);

  return (
    <div style={{ background: '#0a0e17', minHeight: '100vh', padding: '30px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* HEADER ИЗ V25/27 */}
        <header style={{ borderBottom: '2px solid #1e293b', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', letterSpacing: '2px', margin: 0 }}>
            STRATEGIC_INTEL_OS // <span style={{ color: '#00ff41' }}>V33.3_REFINED</span>
          </h1>
          <div style={{ background: '#00ff41', color: '#000', padding: '4px 12px', fontWeight: 'bold', fontSize: '12px' }}>
            UPLINK_STABLE // {new Date(now).toLocaleTimeString()}
          </div>
        </header>

        {/* ОСНОВНЫЕ МОДУЛИ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {data.map(n => (
            <div key={n.id} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '24px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b949e', fontSize: '11px', marginBottom: '15px' }}>
                <span>ID: {n.id}</span>
                <span style={{ color: n.prob > 30 ? '#ff4d4d' : '#00ff41' }}>{n.prob > 30 ? 'CRITICAL' : 'MONITOR'}</span>
              </div>

              {/* ДВОЙНЫЕ ВРЕМЕННЫЕ РАМКИ (ИЗ POLYMARKET) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div style={{ background: '#0d1117', padding: '15px', border: '1px solid #30363d' }}>
                  <div style={{ fontSize: '10px', color: '#8b949e' }}>ДО 28 ФЕВРАЛЯ</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{n.prob_short}%</div>
                </div>
                <div style={{ background: '#0d1117', padding: '15px', border: '1px solid #30363d' }}>
                  <div style={{ fontSize: '10px', color: '#8b949e' }}>ДО 31 МАРТА</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob > 30 ? '#ff4d4d' : '#3b82f6' }}>{n.prob}%</div>
                </div>
              </div>

              {/* ПОЛНОЕ ОПИСАНИЕ (КАК В V25) */}
              <div style={{ marginBottom: '20px', minHeight: '60px' }}>
                <b style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>СПОКИ: {n.deadline}</b>
                <p style={{ fontSize: '12px', color: '#8b949e', margin: 0, lineHeight: '1.4' }}>{n.full_desc}</p>
              </div>

              {/* ОБНОВЛЕННЫЙ WHALE_WATCH (ТРИ ЗВЕНА) */}
              <div style={{ background: '#0d1117', padding: '15px', borderRadius: '4px', border: '1px solid #30363d' }}>
                <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '5px' }}>VERIFIED_PLAYERS_ACTIVITY:</div>
                <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
                  <div><b style={{color: '#3b82f6'}}>L1:</b> RicoSauve666 — <span style={{color: '#8b949e'}}>$12.4M Pos (82% Acc)</span></div>
                  <div><b style={{color: '#3b82f6'}}>L2:</b> Rundeep — <span style={{color: '#8b949e'}}>WinRate 76.4%</span></div>
                  <div><b style={{color: '#3b82f6'}}>L3:</b> GC_WHALE_01 — <span style={{color: '#00ff41'}}>$142,000 Entry Active</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ГЛОССАРИЙ ИЗ V25/27 */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <section style={{ background: '#161b22', border: '1px solid #30363d', padding: '25px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '14px', color: '#58a6ff', marginTop: 0, textTransform: 'uppercase' }}>Глоссарий и разъяснение данных</h3>
            <ul style={{ fontSize: '12px', color: '#8b949e', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li><b>Процент (%)</b> — Рыночная цена вероятности. Резкий рост до 25%+ на февральском контракте — сигнал инсайда.</li>
              <li><b>Whale Position</b> — Крупнейшие верифицированные кошельки. Мы отслеживаем три звена игроков для фильтрации шума.</li>
              <li><b>Timeframes</b> — Разделение на Февраль/Март позволяет видеть скорость подготовки к событию.</li>
            </ul>
          </section>

          {/* SYSTEM_LOG ИЗ V27 */}
          <section style={{ background: '#0d1117', border: '1px solid #30363d', padding: '25px', borderRadius: '8px' }}>
             <h3 style={{ fontSize: '14px', color: '#58a6ff', marginTop: 0 }}>SYSTEM_LOG</h3>
             <div style={{ fontSize: '10px', color: '#444', fontFamily: 'monospace' }}>
                <div>[14:13:30] CONNECTING TO POLYMARKET...</div>
                <div>[14:13:31] UPLINK_STABLE // NO_DATA_LOSS</div>
                <div>[14:13:32] MONITORING: 4 SENSORS ACTIVE</div>
                <div style={{color: '#00ff41'}}>[14:13:37] LIVE_STREAM_OK</div>
             </div>
          </section>
        </div>

      </div>
    </div>
  );
}
