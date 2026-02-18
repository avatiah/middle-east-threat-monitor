'use client';
import React, { useEffect, useState } from 'react';

// Строгая структура данных без симуляций
interface Threat {
  id: string;
  prob_short: number; // Февраль 28
  prob_long: number;  // Март 31
  spike_short?: boolean;
  spike_long?: boolean;
}

export default function ThreatEngineAdmin() {
  const [data, setData] = useState<Threat[]>([]);
  const [now, setNow] = useState(Date.now());

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      
      // Прямое сопоставление данных из API
      if (Array.isArray(json)) {
        setData(json);
      }
    } catch (e) {
      console.error("DATA_FETCH_CRITICAL_FAILURE");
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
    <div style={{ background: '#000', minHeight: '100vh', padding: '30px', color: '#00ff41', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '1px solid #00ff41', paddingBottom: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '10px', marginBottom: '5px' }}>THREAT_ENGINE // ADMIN_PANEL</div>
            <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '2px' }}>STRATEGIC_INTEL_OS V33.8</h1>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px' }}>
            STATUS: <span style={{ color: data.length > 0 ? '#00ff41' : '#ff003c' }}>{data.length > 0 ? 'ONLINE' : 'SYNCING'}</span>
            <br />{new Date(now).toLocaleTimeString()}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {data.map((n) => (
            <div key={n.id} style={{ border: '1px solid #1a1a1a', background: '#050505', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontSize: '10px', color: '#666' }}>ID: {n.id}</span>
                <span style={{ fontSize: '10px', color: '#ff003c' }}>LIVE_MONITOR</span>
              </div>
              
              <h2 style={{ fontSize: '18px', margin: '0 0 20px 0', color: '#fff', textTransform: 'uppercase' }}>
                {n.id === 'ISR-IRN' && "Атака Израиля по Ирану"}
                {n.id === 'USA-STRIKE' && "Удар ВС США по Ирану"}
                {n.id === 'HORMUZ' && "Закрытие Ормузского пролива"}
                {n.id === 'LEB-INV' && "Вторжение в Ливан"}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {/* ГОРИЗОНТ 1: ФЕВРАЛЬ */}
                <div style={{ 
                  padding: '15px', border: n.spike_short ? '1px solid #00ff41' : '1px solid #1a1a1a', 
                  background: '#0a0a0a', textAlign: 'center' 
                }}>
                  <div style={{ fontSize: '9px', color: '#666', marginBottom: '5px' }}>ФЕВРАЛЬ 28</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{n.prob_short}%</div>
                </div>
                {/* ГОРИЗОНТ 2: МАРТ */}
                <div style={{ 
                  padding: '15px', border: n.spike_long ? '1px solid #00ff41' : '1px solid #1a1a1a', 
                  background: '#0a0a0a', textAlign: 'center' 
                }}>
                  <div style={{ fontSize: '9px', color: '#666', marginBottom: '5px' }}>МАРТ 31</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{n.prob_long}%</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '15px' }}>
                {['L1', 'L2', 'L3'].map(tier => (
                  <div key={tier} style={{ marginBottom: '10px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                      <span>{PLAYER_DOSSIER[tier].name} <span style={{color: '#666'}}>[{tier}]</span></span>
                      <span style={{ color: '#00ff41' }}>{PLAYER_DOSSIER[tier].power}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* СИСТЕМНЫЙ ЛОГ */}
        <div style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '15px', fontSize: '10px' }}>
          <div style={{ color: '#666', marginBottom: '5px' }}>CONSOLE_OUTPUT:</div>
          <div>[{new Date().toISOString()}] SYNC_COMPLETED: {data.length} NODES_ACTIVE</div>
          {data.length > 0 && <div style={{color: '#00ff41'}}>[SUCCESS] ISR-IRN_DATA: {data[0].prob_short}% / {data[0].prob_long}%</div>}
        </div>
      </div>
    </div>
  );
}
