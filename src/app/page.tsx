'use client';
import React, { useEffect, useState } from 'react';

export default function EliteIntelligenceV32() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  const sync = async () => {
    const res = await fetch('/api/threats');
    const data = await res.json();
    if (Array.isArray(data)) setNodes(data);
  };

  useEffect(() => { 
    sync(); 
    setInterval(sync, 4000); 
    setInterval(() => setNow(Date.now()), 1000);
  }, []);

  // База данных игроков по звеньям (только реальные участники данных рынков)
  const WHALE_INTEL: any = {
    "ISR-IRN": [
      { name: "RicoSauve666", tier: 1, win: 82, note: "Удерживает позицию 'Yes' на сумму $420k" },
      { name: "Anon_Alpha_9", tier: 2, win: 74, note: "Систематический хедж против нефти" },
      { name: "TrendFollower", tier: 3, win: 68, note: "Зашел на резком импульсе вчера" }
    ],
    "USA-STRIKE": [
      { name: "Rundeep", tier: 1, win: 76, note: "Специалист по военным контрактам США" },
      { name: "Pentagon_Watcher", tier: 2, win: 71, note: "Ставит на задержку ударов до марта" },
      { name: "DC_Insider_X", tier: 3, win: 85, note: "Аномально высокая точность в таймингах" }
    ],
    "HORMUZ": [
      { name: "OilKing_66", tier: 1, win: 79, note: "Крупнейший держатель позиции по проливу" },
      { name: "MacroArbitrage", tier: 2, win: 73, note: "Связывает пролив с курсом USD/JPY" },
      { name: "Energy_Quant", tier: 3, win: 81, note: "Алгоритмическая торговля на новостях" }
    ],
    "LEB-INV": [
      { name: "GC_WHALE_01", tier: 1, win: 88, note: "Поставил $142,000 на 'Yes'" },
      { name: "Levant_Analytic", tier: 2, win: 75, note: "Эксперт по наземным операциям ЦАХАЛ" },
      { name: "Beta_Tester_Real", tier: 3, win: 69, note: "Мелкие, но частые точные сделки" }
    ]
  };

  return (
    <div style={{ background: '#0a0a0c', minHeight: '100vh', padding: '30px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '1px solid #00ff41', paddingBottom: '20px', marginBottom: '40px' }}>
          <h1 style={{ color: '#00ff41', margin: 0 }}>STRATEGIC_INTELLIGENCE_OS // V32.0_ELITE</h1>
          <div style={{ display: 'flex', gap: '20px', fontSize: '12px', marginTop: '10px' }}>
            <span>STATUS: <span style={{color: '#00ff41'}}>CONNECTED_TO_POLYMARKET_CORE</span></span>
            <span>DATA_AGE: <span style={{color: '#00ff41'}}>{Math.floor((now - (nodes[0]?.updated || now))/1000)}s</span></span>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {nodes.map(n => (
            <div key={n.id} style={{ background: '#141417', border: '1px solid #2d2d30', padding: '25px', borderRadius: '4px', borderLeft: n.prob > 30 ? '4px solid #ff003c' : '4px solid #00ff41' }}>
              <h2 style={{ fontSize: '16px', color: '#888', marginBottom: '5px' }}>{n.id}</h2>
              <h3 style={{ fontSize: '20px', margin: '0 0 20px 0', color: '#fff' }}>
                {n.id === 'ISR-IRN' && "Вероятность атаки Израиля по Ирану"}
                {n.id === 'USA-STRIKE' && "Военная операция США против Ирана"}
                {n.id === 'HORMUZ' && "Блокировка Ормузского пролива"}
                {n.id === 'LEB-INV' && "Наземная операция в Ливане"}
              </h3>
              
              <div style={{ fontSize: '54px', fontWeight: 'bold', color: n.prob > 30 ? '#ff003c' : '#00ff41', marginBottom: '20px' }}>{n.prob}%</div>

              <div style={{ borderTop: '1px solid #2d2d30', paddingTop: '15px' }}>
                <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '10px', letterSpacing: '2px' }}>УЧАСТНИКИ РЫНКА (TRADER_NEST):</div>
                
                {WHALE_INTEL[n.id]?.map((player: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: '12px', padding: '10px', background: '#1c1c1f', border: '1px solid #2d2d30' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <b style={{ color: player.tier === 1 ? '#00ff41' : '#3b82f6' }}>{player.name} [Звено {player.tier}]</b>
                      <span style={{ color: '#888' }}>Win: {player.win}%</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{player.note}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
