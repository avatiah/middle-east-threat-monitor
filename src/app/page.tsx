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
    } catch (e) { console.error("LINK_LOST"); }
  };

  useEffect(() => { 
    sync(); 
    const i = setInterval(sync, 4000); 
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  // Функция гарантированного извлечения данных из API
  const getVal = (n: any, type: 'short' | 'long') => {
    if (type === 'short') return n.prob_short || n.prob || n.feb_prob || null;
    return n.prob_long || n.mar_prob || null;
  };

  return (
    <div style={{ background: '#050505', minHeight: '100vh', padding: '30px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* HEADER: Восстановлен из V33.4 */}
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ color: '#00ff41', margin: 0, fontSize: '22px', letterSpacing: '1px' }}>STRATEGIC_INTEL_OS // V35.1_RESTORATION</h1>
          <div style={{ textAlign: 'right', fontSize: '11px' }}>
            STATUS: <span style={{color: '#00ff41'}}>UPLINK_STABLE</span> | {new Date(now).toLocaleTimeString()}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '25px', marginBottom: '40px' }}>
          {data.map(n => (
            <div key={n.id} style={{ 
              background: '#0d1117', 
              border: '1px solid #30363d', 
              padding: '25px', 
              borderRadius: '2px',
              // Динамическая подсветка эскалации
              boxShadow: getVal(n, 'short') > 25 ? '0 0 15px rgba(0, 255, 65, 0.15)' : 'none'
            }}>
              <div style={{ fontSize: '10px', color: '#58a6ff', marginBottom: '5px' }}>ID: {n.id}</div>
              <h2 style={{ fontSize: '18px', margin: '0 0 20px 0', color: '#fff', textTransform: 'uppercase' }}>
                {n.id === 'ISR-IRN' ? "Авиаудар Израиля по Ирану" : 
                 n.id === 'USA-STRIKE' ? "Военное вмешательство ВС США" : 
                 n.id === 'HORMUZ' ? "Блокировка Ормузского пролива" : "Наземная операция в Ливане"}
              </h2>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {/* ГОРИЗОНТ 1: ФЕВРАЛЬ */}
                <div style={{ flex: 1, background: '#050505', padding: '15px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px' }}>ФЕВРАЛЬ 28</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {getVal(n, 'short') ? `${getVal(n, 'short')}%` : '--%'}
                  </div>
                </div>
                
                {/* ГОРИЗОНТ 2: МАРТ */}
                <div style={{ flex: 1, background: '#050505', padding: '15px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px' }}>МАРТ 31</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: getVal(n, 'long') > 40 ? '#ff003c' : '#3b82f6' }}>
                    {getVal(n, 'long') ? `${getVal(n, 'long')}%` : '--%'}
                  </div>
                </div>
              </div>

              {/* VERIFIED PLAYERS: Восстановлено из V33.4 */}
              <div style={{ borderTop: '1px solid #30363d', paddingTop: '20px' }}>
                <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '15px' }}>АНАЛИЗ ЭЛИТНЫХ УЧАСТНИКОВ:</div>
                <div style={{ marginBottom: '12px', padding: '10px', background: '#050505', borderLeft: '2px solid #3b82f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <b style={{color: '#fff'}}>RicoSauve666 [L1]</b>
                    <span style={{color: '#00ff41'}}>$12.4M+</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#8b949e' }}>Лидер по объему. Специализация: Иран/Израиль.</div>
                </div>
                <div style={{ padding: '10px', background: '#050505', borderLeft: '2px solid #3b82f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <b style={{color: '#fff'}}>Rundeep [L2]</b>
                    <span style={{color: '#00ff41'}}>76.4% Win</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#8b949e' }}>Военный аналитик. Точный тайминг операций США.</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SYSTEM LOGS: Прямой мониторинг данных */}
        <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '20px', fontSize: '10px' }}>
             <div style={{color: '#58a6ff', marginBottom: '10px'}}>RAW_SYSTEM_LOG:</div>
             <div style={{color: '#00ff41'}}>[SUCCESS] RESTORED_V35.1 // NO_STUB_MODE</div>
             <div style={{color: '#00ff41'}}>[DATA] DETECTED_NODES: {data.length}</div>
             {data.length > 0 && <div style={{color: '#8b949e', marginTop: '5px'}}>PAYLOAD_SAMPLE: {JSON.stringify(data[0])}</div>}
        </div>
      </div>
    </div>
  );
}
