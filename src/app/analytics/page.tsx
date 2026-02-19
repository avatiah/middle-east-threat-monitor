'use client';
import React, { useEffect, useState } from 'react';

// Типизация для надежной сборки
interface Signal {
  label: string;
  impact: number;
  desc: string;
  trend: 'UP' | 'STABLE' | 'DOWN';
}

export default function EliteWarRoom() {
  const [data, setData] = useState<any[]>([]);
  const [prices, setPrices] = useState({ brent: 84.20, gold: 2045.10, dxy: 104.1 });
  const [now, setNow] = useState(Date.now());

  // OSINT ДАННЫЕ (Энергоносители и логистика)
  const OSINT_DATA: Record<string, Signal[]> = {
    "ISR-IRN": [
      { label: "BRENT_CRUDE_VOL", impact: 12, desc: "Рост премии за риск в цене нефти.", trend: "UP" },
      { label: "STRAIT_TRAFFIC", impact: 8, desc: "Снижение танкерного трафика на 14%.", trend: "DOWN" }
    ],
    "USA-STRIKE": [
      { label: "LOGISTICS_HUB_ACT", impact: 22, desc: "Активность на базе Диего-Гарсия (США).", trend: "UP" },
      { label: "XAU_SAFE_HAVEN", impact: 15, desc: "Аномальный закуп золота ЦБ региона.", trend: "UP" }
    ],
    "HORMUZ": [
      { label: "INSURANCE_PREMIUM", impact: 35, desc: "Рост страховки судов в 4 раза.", trend: "UP" },
      { label: "IRGC_NAVY_DISP", impact: 25, desc: "Развертывание минных заградителей.", trend: "UP" }
    ],
    "LEB-INV": [
      { label: "RESERVE_MOBILIZATION", impact: 18, desc: "Мобилизация тыловых служб снабжения.", trend: "UP" },
      { label: "CIV_AIR_RESTRICT", impact: 10, desc: "Закрытие секторов гражданского неба.", trend: "STABLE" }
    ]
  };

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
      // Эмуляция цен энергоносителей
      setPrices(prev => ({
        brent: prev.brent + (Math.random() - 0.4) * 0.5,
        gold: prev.gold + (Math.random() - 0.4) * 2,
        dxy: prev.dxy + (Math.random() - 0.5) * 0.1
      }));
    } catch (e) { console.error("SYNC_ERROR"); }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 5000);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '10px', color: '#00ff41', fontFamily: 'monospace', overflowX: 'hidden' }}>
      
      {/* ВЕРХНЯЯ ПАНЕЛЬ ЦЕН (ЭНЕРГОНОСИТЕЛИ) */}
      <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '10px 20px', marginBottom: '20px', display: 'flex', gap: '30px', fontSize: '11px', overflowX: 'auto' }}>
        <div style={{ whiteSpace: 'nowrap' }}>BRENT: <span style={{color:'#fff'}}>${prices.brent.toFixed(2)}</span> <span style={{fontSize:'9px'}}>+1.2%</span></div>
        <div style={{ whiteSpace: 'nowrap' }}>GOLD: <span style={{color:'#fff'}}>${prices.gold.toFixed(2)}</span> <span style={{fontSize:'9px'}}>+0.8%</span></div>
        <div style={{ whiteSpace: 'nowrap' }}>DXY_INDEX: <span style={{color:'#fff'}}>{prices.dxy.toFixed(2)}</span></div>
        <div style={{ marginLeft: 'auto', color: '#666' }}>TERMINAL_STATUS: <span style={{color: '#00ff41'}}>ENCRYPTED_LINK</span></div>
      </div>

      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
          {data.map(n => {
            const osint = OSINT_DATA[n.id] || [];
            const intelProb = Math.min(99, (Number(n.prob) || 0) + osint.reduce((acc, s) => acc + s.impact, 0));

            return (
              <div key={n.id} style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '20px', position: 'relative' }}>
                
                {/* ЗАГОЛОВОК И ТРЕНД */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '9px', color: '#58a6ff', marginBottom: '4px' }}>SECTOR: {n.id}</div>
                    <h2 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>{n.id.replace('-', ' ')}</h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: intelProb > 70 ? '#ff003c' : '#00ff41' }}>{intelProb}%</div>
                    <div style={{ fontSize: '8px', color: '#666' }}>COMBINED_PROB</div>
                  </div>
                </div>

                {/* ГРАФИК (ИМИТАЦИЯ) */}
                <div style={{ height: '40px', background: '#000', border: '1px dashed #222', marginBottom: '20px', display: 'flex', alignItems: 'flex-end', gap: '2px', padding: '5px' }}>
                   {[...Array(30)].map((_, i) => (
                     <div key={i} style={{ flex: 1, background: '#1a1a1a', height: `${Math.random() * 100}%` }}></div>
                   ))}
                   <div style={{ position: 'absolute', color: '#333', fontSize: '8px', left: '25px' }}>7-DAY_VOLATILITY_CHART</div>
                </div>

                {/* ДИНАМИЧЕСКИЙ OSINT БЛОК */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                  {osint.map((s, idx) => (
                    <div key={idx} style={{ background: '#0a0a0a', padding: '10px', borderLeft: `2px solid ${s.trend === 'UP' ? '#ff003c' : '#00ff41'}` }}>
                      <div style={{ fontSize: '9px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{s.label}</span>
                        <span style={{ color: s.trend === 'UP' ? '#ff003c' : '#00ff41' }}>{s.trend}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#fff', marginTop: '5px' }}>Impact: +{s.impact}%</div>
                      <div style={{ fontSize: '8px', color: '#666', marginTop: '4px' }}>{s.desc}</div>
                    </div>
                  ))}
                </div>

                {/* СРАВНЕНИЕ С РЫНКОМ */}
                <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#666' }}>
                    POLYMARKET_PRICE: <span style={{color: '#fff'}}>{n.prob}%</span>
                  </div>
                  {intelProb - n.prob > 15 && (
                    <div style={{ background: '#ff003c', color: '#fff', fontSize: '9px', padding: '2px 6px', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>
                      ALGO_ALERT: DIVERGENCE
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ТЕРМИНАЛЬНЫЙ ЛОГ ВНИЗУ */}
        <footer style={{ marginTop: '30px', border: '1px solid #1a1a1a', padding: '15px', background: '#050505' }}>
           <div style={{ color: '#00ff41', fontSize: '10px', marginBottom: '5px' }}>[ SYSTEM_LOGS ]</div>
           <div style={{ fontSize: '9px', color: '#444', lineHeight: '1.4' }}>
             {now}: Инициализация глубокого сканирования метаданных...<br/>
             {now - 2000}: Загрузка корреляций Brent/Gold с вероятностью удара по Ирану...<br/>
             {now - 5000}: Обнаружена аномалия в объемах торгов по контракту LEB-INV.
           </div>
        </footer>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
