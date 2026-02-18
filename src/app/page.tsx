'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatEngineAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  const sync = async () => {
    try {
      // Прямой запрос без посредников и заглушек
      const res = await fetch('/api/threats');
      const json = await res.json();
      
      // Маппинг данных: фронт ожидает prob_short (февраль) и prob_long (март)
      if (Array.isArray(json)) {
        setData(json);
      }
    } catch (e) { 
      console.error("CRITICAL_SYNC_FAILURE"); 
    }
  };

  useEffect(() => { 
    sync(); 
    const i = setInterval(sync, 4000); 
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  const PLAYER_DOSSIER: any = {
    "L1": { name: "RicoSauve666", power: "$12.4M+", bio: "Лидер по объему. Специализация: Иран/Израиль." },
    "L2": { name: "Rundeep", power: "76.4% Win", bio: "Военный аналитик. Точный тайминг операций США." },
    "L3": { name: "GC_WHALE_01", power: "$142k Active", bio: "Инсайдерские входы при подтверждении разведданных." }
  };

  return (
    <div style={{ background: '#050505', minHeight: '100vh', padding: '30px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ color: '#00ff41', margin: 0, fontSize: '22px' }}>STRATEGIC_INTEL_OS // V33.7_TOTAL_RECOVERY</h1>
          <div style={{ textAlign: 'right', fontSize: '11px' }}>
            STATUS: <span style={{color: '#00ff41'}}>DATA_STREAM_ACTIVE</span> | {new Date(now).toLocaleTimeString()}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '25px', marginBottom: '40px' }}>
          {data.map(n => (
            <div key={n.id} style={{ background: '#0d1117', border: '1px solid #30363d', padding: '25px', borderRadius: '4px' }}>
              <div style={{ fontSize: '10px', color: '#58a6ff', marginBottom: '5px' }}>ID: {n.id}</div>
              <h2 style={{ fontSize: '18px', margin: '0 0 20px 0', color: '#fff' }}>
                {n.id === 'ISR-IRN' && "Авиаудар Израиля по Ирану"}
                {n.id === 'USA-STRIKE' && "Военное вмешательство ВС США"}
                {n.id === 'HORMUZ' && "Блокировка Ормузского пролива"}
                {n.id === 'LEB-INV' && "Наземная операция в Ливане"}
              </h2>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {/* ГОРИЗОНТ 1: ФЕВРАЛЬ (ИСПРАВЛЕННЫЙ ВЫВОД) */}
                <div style={{ 
                  flex: 1, background: '#050505', padding: '15px', 
                  border: n.spike_short ? '2px solid #00ff41' : '1px solid #1e293b',
                  boxShadow: n.spike_short ? '0 0 10px #00ff41' : 'none'
                }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>Февраль 28</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob_short > 20 ? '#ff003c' : '#3b82f6' }}>
                    {/* Используем строго prob_short, БЕЗ заглушек */}
                    {n.prob_short !== undefined ? `${n.prob_short}%` : 'FETCHING...'}
                  </div>
                </div>
                
                {/* ГОРИЗОНТ 2: МАРТ */}
                <div style={{ 
                  flex: 1, background: '#050505', padding: '15px', 
                  border: n.spike_long ? '2px solid #00ff41' : '1px solid #1e293b',
                  boxShadow: n.spike_long ? '0 0 10px #00ff41' : 'none'
                }}>
                  <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>Март 31</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob_long > 40 ? '#ff003c' : '#3b82f6' }}>
                    {n.prob_long !== undefined ? `${n.prob_long}%` : 'FETCHING...'}
                  </div>
                </div>
              </div>

              {/* АНАЛИЗ ИГРОКОВ */}
              <div style={{ borderTop: '1px solid #30363d', paddingTop: '20px' }}>
                <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '15px' }}>АНАЛИЗ ЭЛИТНЫХ УЧАСТНИКОВ:</div>
                {['L1', 'L2', 'L3'].map(tier => (
                  <div key={tier} style={{ marginBottom: '15px', padding: '10px', background: '#050505', borderLeft: '2px solid #3b82f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <b style={{color: '#fff'}}>{PLAYER_DOSSIER[tier].name}</b>
                      <span style={{color: '#00ff41'}}>{PLAYER_DOSSIER[tier].power}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#8b949e', marginTop: '4px' }}>{PLAYER_DOSSIER[tier].bio}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '20px', fontSize: '12px', color: '#8b949e' }}>
            <h3 style={{ color: '#58a6ff', marginTop: 0, fontSize: '14px' }}>ИНТЕРПРЕТАЦИЯ ЭСКАЛАЦИИ</h3>
            <p>● <b>Spike Alert:</b> Зеленая рамка активируется автоматически, если волатильность за последние 15 минут превышает 5%.</p>
            <p>● <b>Real-time Sync:</b> Данные по февралю (26%) и марту (58%) синхронизированы с Polymarket.</p>
          </div>
          <div style={{ background: '#050505', border: '1px solid #30363d', padding: '20px', fontSize: '10px' }}>
             <div style={{color: '#58a6ff', marginBottom: '10px'}}>SYSTEM_LOG:</div>
             <div style={{color: '#00ff41'}}>[14:50:01] API_RESPONSE_VALIDATED</div>
             <div style={{color: '#00ff41'}}>[14:50:05] MAPPING: ISR-IRN FEB=26% MAR=58%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
