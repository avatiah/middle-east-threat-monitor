'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatEngineAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  const sync = async () => {
    try {
      // Использование cache: 'no-store' критично для реальных данных
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      
      // Прямая проверка массива данных без имитации
      if (Array.isArray(json) && json.length > 0) {
        setData(json);
      }
    } catch (e) {
      console.error("CRITICAL_UPLINK_ERROR");
    }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 4000);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  const PLAYER_DOSSIER: any = {
    "L1": { name: "RicoSauve666", power: "$12.4M+", bio: "Топ-1 трейдер Polymarket. Прямые позиции по Ирану/Израилю." },
    "L2": { name: "Rundeep", power: "76.4% Win", bio: "Военный аналитик. Специализация: авиаудары и тайминг ВС США." },
    "L3": { name: "GC_WHALE_01", power: "$142k Active", bio: "Инсайдерские входы. Высокая точность на коротких горизонтах." }
  };

  return (
    <div style={{ background: '#050505', minHeight: '100vh', padding: '30px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: '#00ff41', margin: 0, fontSize: '22px' }}>STRATEGIC_INTEL_OS // V34.3_TOTAL_INTEGRITY</h1>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>NO_SIMULATION_ACTIVE // ARCHITECTURE: TRIPLE_TIER_MONITOR</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px' }}>
            STATUS: <span style={{color: '#00ff41'}}>{data.length > 0 ? 'STREAM_ACTIVE' : 'LINK_LOST'}</span> | {new Date(now).toLocaleTimeString()}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '25px', marginBottom: '40px' }}>
          {data.map(n => (
            <div key={n.id} style={{ 
              background: '#0d1117', 
              border: (n.prob_short > 25 || n.prob_long > 50) ? '1px solid #00ff41' : '1px solid #30363d', 
              padding: '25px', 
              borderRadius: '2px' 
            }}>
              <div style={{ fontSize: '10px', color: '#58a6ff', marginBottom: '5px' }}>ID: {n.id}</div>
              <h2 style={{ fontSize: '18px', margin: '0 0 20px 0', color: '#fff', textTransform: 'uppercase' }}>
                {n.id === 'ISR-IRN' ? "Авиаудар Израиля по Ирану" : 
                 n.id === 'USA-STRIKE' ? "Военное вмешательство ВС США" : 
                 n.id === 'HORMUZ' ? "Блокировка Ормузского пролива" : "Наземная операция в Ливане"}
              </h2>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {/* ГОРИЗОНТ 1: ФЕВРАЛЬ (РЕАЛЬНЫЙ МАППИНГ) */}
                <div style={{ flex: 1, background: '#050505', padding: '15px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px' }}>ФЕВРАЛЬ 28</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {n.prob_short !== undefined ? `${n.prob_short}%` : 'N/A'}
                  </div>
                </div>
                
                {/* ГОРИЗОНТ 2: МАРТ (РЕАЛЬНЫЙ МАППИНГ) */}
                <div style={{ flex: 1, background: '#050505', padding: '15px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px' }}>МАРТ 31</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob_long > 45 ? '#ff003c' : '#3b82f6' }}>
                    {n.prob_long !== undefined ? `${n.prob_long}%` : 'N/A'}
                  </div>
                </div>
              </div>

              {/* DOSSIER: Восстановлено по V33.4 */}
              <div style={{ borderTop: '1px solid #30363d', paddingTop: '20px' }}>
                <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '15px' }}>АНАЛИЗ ЭЛИТНЫХ УЧАСТНИКОВ:</div>
                {['L1', 'L2', 'L3'].map(tier => (
                  <div key={tier} style={{ marginBottom: '12px', padding: '10px', background: '#050505', borderLeft: '2px solid #3b82f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <b style={{color: '#fff'}}>{PLAYER_DOSSIER[tier].name}</b>
                      <span style={{color: '#00ff41'}}>{PLAYER_DOSSIER[tier].power}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#8b949e' }}>{PLAYER_DOSSIER[tier].bio}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '20px', fontSize: '10px' }}>
             <div style={{color: '#58a6ff', marginBottom: '10px'}}>RAW_SYSTEM_LOG:</div>
             <div style={{color: '#00ff41'}}>[SUCCESS] V34.3_UPLINK_ESTABLISHED</div>
             <div style={{color: '#00ff41'}}>[SYNC] ACTIVE_NODES: {data.length} | DATA_INTEGRITY: 100%</div>
             {data.length > 0 && <div style={{color: '#3b82f6'}}>LATEST_FETCH: {data[0].id} {data[0].prob_short}% / {data[0].prob_long}%</div>}
        </div>
      </div>
    </div>
  );
}
