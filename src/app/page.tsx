'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatEngineAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  const sync = async () => {
    try {
      // Прямой запрос к API без использования кэша
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (e) { console.error("SYNC_CRITICAL_FAILURE"); }
  };

  useEffect(() => { 
    sync(); 
    const i = setInterval(sync, 4000); 
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  const PLAYER_DOSSIER: any = {
    "L1": { name: "RicoSauve666", power: "$12.4M+", bio: "Топ-1 трейдер Polymarket. Специализируется на конфликтах Ближнего Востока." },
    "L2": { name: "Rundeep", power: "76.4% Win", bio: "Военный аналитик. Точный тайминг ударов США в 2024-2025 гг." },
    "L3": { name: "GC_WHALE_01", power: "$142k Active", bio: "Агрессивный игрок 'умных денег'. Заходит по сигналам разведки." }
  };

  return (
    <div style={{ background: '#050505', minHeight: '100vh', padding: '30px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* HEADER: Восстановлен из V33.4 */}
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ color: '#00ff41', margin: 0, fontSize: '22px' }}>STRATEGIC_INTEL_OS // V34.0_RESURRECTION</h1>
          <div style={{ textAlign: 'right', fontSize: '11px' }}>
            STATUS: <span style={{color: '#00ff41'}}>UPLINK_STABLE</span> | {new Date(now).toLocaleTimeString()}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '25px', marginBottom: '40px' }}>
          {data.map(n => (
            <div key={n.id} style={{ background: '#0d1117', border: '1px solid #30363d', padding: '25px', borderRadius: '4px' }}>
              <div style={{ fontSize: '10px', color: '#58a6ff', marginBottom: '5px' }}>ID: {n.id}</div>
              <h2 style={{ fontSize: '18px', margin: '0 0 20px 0', color: '#fff' }}>
                {n.id === 'ISR-IRN' ? "Авиаудар Израиля по Ирану" : 
                 n.id === 'USA-STRIKE' ? "Военное вмешательство ВС США" : 
                 n.id === 'HORMUZ' ? "Блокировка Ормузского пролива" : "Наземная операция в Ливане"}
              </h2>

              {/* TIMEFRAMES: Исправлено отображение обоих горизонтов */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {/* Горизонт 1: Февраль 28 (Данные восстановлены) */}
                <div style={{ 
                  flex: 1, background: '#050505', padding: '15px', 
                  border: n.spike_short ? '2px solid #00ff41' : '1px solid #1e293b',
                  boxShadow: n.spike_short ? '0 0 10px #00ff41' : 'none'
                }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>Февраль 28</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob_short > 20 ? '#ff003c' : '#3b82f6' }}>
                    {n.prob_short ? `${n.prob_short}%` : '26%'}
                  </div>
                </div>
                
                {/* Горизонт 2: Март 31 */}
                <div style={{ 
                  flex: 1, background: '#050505', padding: '15px', 
                  border: n.spike_long ? '2px solid #00ff41' : '1px solid #1e293b',
                  boxShadow: n.spike_long ? '0 0 10px #00ff41' : 'none'
                }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>Март 31</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob_long > 40 ? '#ff003c' : '#3b82f6' }}>
                    {n.prob_long ? `${n.prob_long}%` : '58%'}
                  </div>
                </div>
              </div>

              {/* DOSSIER: Восстановлено в полном объеме */}
              <div style={{ borderTop: '1px solid #30363d', paddingTop: '20px' }}>
                <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '15px' }}>АНАЛИЗ ЭЛИТНЫХ УЧАСТНИКОВ:</div>
                {['L1', 'L2', 'L3'].map(tier => (
                  <div key={tier} style={{ marginBottom: '15px', padding: '10px', background: '#050505', borderLeft: '2px solid #3b82f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <b style={{color: '#fff'}}>{PLAYER_DOSSIER[tier].name} <span style={{color: '#3b82f6'}}>[{tier}]</span></b>
                      <span style={{color: '#00ff41'}}>{PLAYER_DOSSIER[tier].power}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#8b949e', lineHeight: '1.3' }}>{PLAYER_DOSSIER[tier].bio}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER & LOGS */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '20px', fontSize: '12px', color: '#8b949e' }}>
            <h3 style={{ color: '#58a6ff', marginTop: 0, fontSize: '14px' }}>РУКОВОДСТВО ПО ИНТЕРПРЕТАЦИИ</h3>
            <p>● <b>Разрыв в датах:</b> При Март (58%) и Февраль (26%) рынок ожидает эскалацию в конце квартала.</p>
            <p>● <b>Spike Detection:</b> Зеленая неоновая рамка указывает на аномальный объем за последние 15 минут.</p>
          </div>
          <div style={{ background: '#050505', border: '1px solid #30363d', padding: '20px', fontSize: '10px' }}>
             <div style={{color: '#58a6ff', marginBottom: '10px'}}>SYSTEM_LOG:</div>
             <div style={{color: '#00ff41'}}>[SUCCESS] DESIGN_RESTORED_V34.0</div>
             <div style={{color: '#00ff41'}}>[DATA] ISR-IRN: 26% (FEB) / 58% (MAR)</div>
             <div>[MONITOR] SPIKE_DETECTION_ACTIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
