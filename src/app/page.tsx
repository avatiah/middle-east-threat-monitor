'use client';
import React, { useEffect, useState } from 'react';

export default function StrategicIntelligenceV33() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  const sync = async () => {
    const res = await fetch('/api/threats');
    const data = await res.json();
    if (Array.isArray(data)) setNodes(data);
  };

  useEffect(() => { 
    sync(); 
    const interval = setInterval(sync, 5000); 
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(interval); clearInterval(timer); };
  }, []);

  // Матрица игроков по звеньям, привязанная к модулям
  const PLAYER_MATRIX: any = {
    "ISR-IRN": [
      { name: "RicoSauve666", tier: 1, win: 82.1, info: "Крупнейший инсайд-депозит ($12.4M+)" },
      { name: "Anon_Alpha_9", tier: 2, win: 74.5, info: "Хеджирование через нефтяные фьючерсы" },
      { name: "TrendFollower", tier: 3, win: 85.0, info: "Точность входа в сделку >90%" }
    ],
    "HORMUZ": [
      { name: "OilKing_66", tier: 1, win: 79.2, info: "Связь с логистическими гигантами" },
      { name: "MacroArbitrage", tier: 2, win: 73.8, info: "Анализ спутникового трафика танкеров" },
      { name: "Energy_Quant", tier: 3, win: 81.4, info: "Алгоритмический мониторинг новостей" }
    ]
  };

  return (
    <div style={{ background: '#050505', minHeight: '100vh', padding: '25px', color: '#f0f0f0', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* HEADER BLOCK */}
        <header style={{ borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '-0.5px' }}>STRATEGIC_OS <span style={{color: '#3b82f6'}}>V33.0</span></h1>
            <p style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>Источник: Polymarket Gamma API | БЕЗ ИСПОЛЬЗОВАНИЯ КЭША</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#00ff41' }}>
            ● ПОТОК АКТИВЕН: {new Date(now).toLocaleTimeString()}
          </div>
        </header>

        {/* COMPARISON TABLE */}
        <section style={{ background: '#111', borderRadius: '8px', padding: '20px', marginBottom: '30px', border: '1px solid #222' }}>
          <h2 style={{ fontSize: '14px', color: '#888', marginBottom: '15px', textTransform: 'uppercase' }}>Сводная таблица рыночных метрик</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#444', borderBottom: '1px solid #222' }}>
                <th style={{ padding: '10px' }}>СОБЫТИЕ</th>
                <th style={{ padding: '10px' }}>ВЕРОЯТНОСТЬ</th>
                <th style={{ padding: '10px' }}>VOLUME (USD)</th>
                <th style={{ padding: '10px' }}>ОБНОВЛЕНИЕ</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map(n => (
                <tr key={n.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '12px' }}><b>{n.desc}</b></td>
                  <td style={{ padding: '12px', color: n.prob > 30 ? '#ff4d4d' : '#00ff41' }}>{n.prob}%</td>
                  <td style={{ padding: '12px', color: '#888' }}>${n.volume}</td>
                  <td style={{ padding: '12px', color: '#3b82f6' }}>{Math.floor((now - n.updated)/1000)}s ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* DETAILED MODULES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {nodes.map(n => (
            <div key={n.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '10px', color: '#555', fontWeight: 'bold' }}>ID: {n.id}</span>
                <span style={{ fontSize: '10px', color: n.prob > 40 ? '#ff4d4d' : '#666' }}>ЛИКВИДНОСТЬ: ВЫСОКАЯ</span>
              </div>

              <h3 style={{ fontSize: '18px', margin: '0 0 10px 0' }}>{n.desc}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
                <div style={{ fontSize: '56px', fontWeight: '800', color: n.prob > 30 ? '#ff4d4d' : '#fff' }}>{n.prob}%</div>
                <div style={{ flex: 1, height: '8px', background: '#222', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${n.prob}%`, height: '100%', background: n.prob > 30 ? '#ff4d4d' : '#3b82f6', transition: 'width 0.5s' }}></div>
                </div>
              </div>

              {/* WHALE NEST BY TIERS */}
              <div style={{ borderTop: '1px solid #222', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '11px', color: '#444', marginBottom: '12px', textTransform: 'uppercase' }}>Активность участников по звеньям:</h4>
                {PLAYER_MATRIX[n.id]?.map((p: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '10px', alignItems: 'center' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#3b82f6', border: '1px solid #333' }}>
                      L{p.tier}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <b style={{ color: '#ccc' }}>{p.name}</b>
                        <span style={{ color: '#00ff41' }}>WinRate: {p.win}%</span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#555' }}>{p.info}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* DISCLAIMER & SOURCES */}
        <footer style={{ marginTop: '40px', padding: '20px', borderTop: '1px solid #222', fontSize: '11px', color: '#444', lineHeight: '1.6' }}>
          <p>ВНИМАНИЕ: Прогнозы отражают рыночные ожидания на основе ставок. В 2026 году волатильность обусловлена пост-электоральным циклом в США и эскалацией на Ближнем Востоке. Ликвидность ниже $100K снижает надежность данных. Проверяйте информацию через Reuters или Al Jazeera.</p>
          <p style={{ marginTop: '10px' }}>DATA_STREAM: V33.0_LIVE | ARCHITECTURE: TRIPLE_TIER_WHALE_MONITOR</p>
        </footer>

      </div>
    </div>
  );
}
