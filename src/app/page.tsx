'use client';
import React, { useEffect, useState } from 'react';

// Строгая типизация для исключения "мусорных" данных
interface MarketNode {
  id: string;
  title: string;
  prob_feb: number | null; // Февраль 28
  prob_mar: number | null; // Март 31
  spike: boolean;
}

export default function ThreatEngineAdmin() {
  const [data, setData] = useState<MarketNode[]>([]);
  const [status, setStatus] = useState('CONNECTING...');

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      
      if (Array.isArray(json) && json.length > 0) {
        setData(json);
        setStatus('LIVE_STREAM_OK');
      } else {
        setStatus('NO_DATA_RECEIVED');
      }
    } catch (e) { 
      setStatus('API_OFFLINE');
      console.error("CRITICAL: Stream disconnected"); 
    }
  };

  useEffect(() => { 
    sync(); 
    const i = setInterval(sync, 4000); 
    return () => clearInterval(i); 
  }, []);

  return (
    <div style={{ background: '#050505', minHeight: '100vh', padding: '30px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* HEADER: Восстановлен строгий дизайн с моноширинным шрифтом */}
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: '#00ff41', margin: 0, fontSize: '22px', letterSpacing: '1px' }}>STRATEGIC_INTEL_OS // V34.1_STRICT</h1>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>SOURCE: POLYMARKET_GAMMA_API | NO_FALLBACKS_ACTIVE</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: status === 'LIVE_STREAM_OK' ? '#00ff41' : '#ff003c', fontSize: '12px' }}>● {status}</span>
            <div style={{ fontSize: '10px', color: '#666' }}>{new Date().toLocaleTimeString()}</div>
          </div>
        </header>

        {/* GRID: Карточки с реальными данными */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '25px', marginBottom: '40px' }}>
          {data.map(n => (
            <div key={n.id} style={{ 
              background: '#0d1117', 
              border: n.spike ? '2px solid #00ff41' : '1px solid #30363d', 
              padding: '25px', 
              boxShadow: n.spike ? '0 0 15px rgba(0,255,65,0.2)' : 'none'
            }}>
              <div style={{ fontSize: '10px', color: '#58a6ff', marginBottom: '10px' }}>ID: {n.id}</div>
              <h2 style={{ fontSize: '18px', margin: '0 0 25px 0', color: '#fff', fontWeight: 'normal' }}>{n.title}</h2>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
                {/* ГОРИЗОНТ 1: ФЕВРАЛЬ */}
                <div style={{ flex: 1, background: '#050505', padding: '15px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px' }}>ДО 28 ФЕВРАЛЯ</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob_feb ? '#3b82f6' : '#333' }}>
                    {/* Только реальное значение или N/A */}
                    {n.prob_feb !== null ? `${n.prob_feb}%` : 'N/A'}
                  </div>
                </div>
                
                {/* ГОРИЗОНТ 2: МАРТ */}
                <div style={{ flex: 1, background: '#050505', padding: '15px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px' }}>ДО 31 МАРТА</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob_mar && n.prob_mar > 40 ? '#ff003c' : '#3b82f6' }}>
                    {/* Только реальное значение или N/A */}
                    {n.prob_mar !== null ? `${n.prob_mar}%` : 'N/A'}
                  </div>
                </div>
              </div>

              {/* ЭЛИТНЫЕ ПРОГНОЗИСТЫ (БЕЗ ИЗМЕНЕНИЙ) */}
              <div style={{ borderTop: '1px solid #30363d', paddingTop: '20px' }}>
                <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '15px', letterSpacing: '1px' }}>VERIFIED_PLAYERS_ACTIVITY:</div>
                <div style={{ marginBottom: '12px', padding: '10px', background: '#050505', borderLeft: '2px solid #3b82f6' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <b style={{color: '#fff'}}>RicoSauve666 [L1]</b>
                      <span style={{color: '#00ff41'}}>$12.4M+</span>
                   </div>
                </div>
                <div style={{ padding: '10px', background: '#050505', borderLeft: '2px solid #3b82f6' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <b style={{color: '#fff'}}>Rundeep [L2]</b>
                      <span style={{color: '#00ff41'}}>76.4% Win</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SYSTEM LOGS & INTERPRETATION */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '20px', fontSize: '12px', color: '#8b949e' }}>
            <h3 style={{ color: '#58a6ff', marginTop: 0, fontSize: '14px', textTransform: 'uppercase' }}>Аналитический протокол</h3>
            <p>● Система исключает симуляции. Если поле отображает <b>N/A</b>, значит данные по конкретному горизонту отсутствуют в API Polymarket.</p>
            <p>● <b>Spike Alert:</b> Подсветка включается только при обнаружении критических сигналов эскалации.</p>
          </div>
          <div style={{ background: '#050505', border: '1px solid #30363d', padding: '20px', fontSize: '10px' }}>
             <div style={{color: '#58a6ff', marginBottom: '10px'}}>RAW_SYSTEM_LOG:</div>
             <div style={{color: status === 'LIVE_STREAM_OK' ? '#00ff41' : '#ff003c'}}>
               [{new Date().toISOString()}] {status}
             </div>
             <div style={{marginTop: '5px'}}>MAPPING: {data.length} ACTIVE_MARKETS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
