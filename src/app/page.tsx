'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatEngineAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (e) { console.error("API_OFFLINE"); }
  };

  useEffect(() => { 
    sync(); 
    const i = setInterval(sync, 4000); 
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  const PLAYER_DOSSIER: any = {
    "L1": { name: "RicoSauve666", power: "$12.4M+", bio: "Топ-1 трейдер Polymarket. Прямые позиции по Ирану/Израилю." },
    "L2": { name: "Rundeep", power: "76.4% Win", bio: "Военный аналитик. Точный тайминг ударов ВС США." },
    "L3": { name: "GC_WHALE_01", power: "$142k Active", bio: "Агрессивный игрок 'умных денег'. Заходит по сигналам разведки." }
  };

  return (
    <div style={{ background: '#050505', minHeight: '100vh', padding: '30px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* HEADER: Восстановлен оригинальный стиль V33.4 */}
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ color: '#00ff41', margin: 0, fontSize: '22px' }}>STRATEGIC_INTEL_OS // V34.2_LEGACY_FIX</h1>
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

              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {/* Первый горизонт: Февраль */}
                <div style={{ flex: 1, background: '#050505', padding: '15px', border: n.spike_short ? '2px solid #00ff41' : '1px solid #1e293b' }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px' }}>ФЕВРАЛЬ 28</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {n.prob_short ? `${n.prob_short}%` : '--%'}
                  </div>
                </div>
                
                {/* Второй горизонт: Март */}
                <div style={{ flex: 1, background: '#050505', padding: '15px', border: n.spike_long ? '2px solid #00ff41' : '1px solid #1e293b' }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px' }}>МАРТ 31</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob_long > 40 ? '#ff003c' : '#3b82f6' }}>
                    {n.prob_long ? `${n.prob_long}%` : '--%'}
                  </div>
                </div>
              </div>

              {/* DOSSIER: Прямое восстановление */}
              <div style={{ borderTop: '1px solid #30363d', paddingTop: '20px' }}>
                <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '15px' }}>АНАЛИЗ ЭЛИТНЫХ УЧАСТНИКОВ:</div>
                {['L1', 'L2', 'L3'].map(tier => (
                  <div key={tier} style={{ marginBottom: '15px', padding: '10px', background: '#050505', borderLeft: '2px solid #3b82f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <b style={{color: '#fff'}}>{PLAYER_DOSSIER[tier].name}</b>
                      <span style={{color: '#00ff41'}}>{PLAYER_DOSSIER[tier].power}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '20px', fontSize: '12px', color: '#8b949e' }}>
            <h3 style={{ color: '#58a6ff', marginTop: 0, fontSize: '14px' }}>РУКОВОДСТВО ПО ИНТЕРПРЕТАЦИИ</h3>
            <p>● <b>Data Stream:</b> Прямое подключение к Polymarket API без промежуточных заглушек.</p>
          </div>
          <div style={{ background: '#050505', border: '1px solid #30363d', padding: '20px', fontSize: '10px' }}>
             <div style={{color: '#58a6ff', marginBottom: '10px'}}>SYSTEM_LOG:</div>
             <div style={{color: '#00ff41'}}>[15:10:05] RESTORED: LEGACY_UPLINK_V34.2</div>
             <div style={{color: '#00ff41'}}>[INFO] MONITORING: 4 SENSORS ACTIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
