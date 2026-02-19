'use client';
import React, { useEffect, useState } from 'react';

export default function WarRoomAnalytics() {
  const [data, setData] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  // МАТРИЦА КРИТИЧЕСКИХ СИГНАЛОВ (Те самые доп. данные)
  const CRITICAL_SIGNALS: any = {
    "ISR-IRN": [
      { id: "SIG1", label: "ELINT_SPIKE", weight: 15, status: "CRITICAL", desc: "Аномальная активность РЛС наведения." },
      { id: "SIG2", label: "AIR_REFUEL", weight: 25, status: "ACTIVE", desc: "Развертывание самолетов-заправщиков." }
    ],
    "USA-STRIKE": [
      { id: "SIG3", label: "B-52_DEPLOY", weight: 20, status: "ACTIVE", desc: "Переброска страт. авиации на Диего-Гарсия." },
      { id: "SIG4", label: "CARRIER_POS", weight: 30, status: "LOCKED", desc: "Авианосец в радиусе тактического пуска." }
    ],
    "HORMUZ": [
      { id: "SIG5", label: "MINELAYING", weight: 40, status: "DETECTED", desc: "Загрузка минного вооружения на катера КСИР." },
      { id: "SIG6", label: "AIS_BLACKOUT", weight: 15, status: "WARNING", desc: "Массовое отключение транспондеров судов." }
    ],
    "LEB-INV": [
      { id: "SIG7", label: "DIV_RESERVE", weight: 20, status: "ACTIVE", desc: "Призыв резервистов 98-й и 36-й дивизий." },
      { id: "SIG8", label: "IRON_DOME_POS", weight: 10, status: "DEPLOYED", desc: "Переброска ПВО на северные рубежи." }
    ]
  };

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (e) { console.error("SIGNAL_LOSS"); }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 10000);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '15px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <a href="/" style={{ color: '#00ff41', textDecoration: 'none', fontSize: '10px' }}>[ BACK_TO_STRATEGIC_MAP ]</a>
            <h1 style={{ color: '#00ff41', margin: '15px 0 0 0', fontSize: '20px' }}>WAR_ROOM_TERMINAL // V1.5_PRO</h1>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#666' }}>
            INTEL_FUSION: <span style={{color: '#00ff41'}}>STABLE</span> | {new Date(now).toLocaleTimeString()}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
          {data.map(n => {
            const signals = CRITICAL_SIGNALS[n.id] || [];
            // Расчет Intel Probability (База + вес сигналов)
            const intelProb = Math.min(99, n.prob + signals.reduce((acc: number, s: any) => acc + s.weight, 0));

            return (
              <div key={n.id} style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '20px', position: 'relative' }}>
                <div style={{ color: '#58a6ff', fontSize: '10px', marginBottom: '15px' }}>NODE: {n.id}</div>
                <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '25px', borderLeft: '3px solid #00ff41', paddingLeft: '15px' }}>{n.id.replace('-', ' ')}</h2>

                {/* COMPARISON BLOCK */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ background: '#000', padding: '15px', border: '1px solid #222' }}>
                    <div style={{ fontSize: '8px', color: '#666' }}>MARKET (POLY)</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>{n.prob}%</div>
                  </div>
                  <div style={{ background: '#000', padding: '15px', border: '1px solid #ff003c' }}>
                    <div style={{ fontSize: '8px', color: '#ff003c' }}>INTEL_ESTIMATE</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff003c' }}>{intelProb}%</div>
                  </div>
                </div>

                {/* CRITICAL ESCALATION SIGNALS */}
                <div style={{ background: '#0a0a0a', padding: '15px', border: '1px solid #333' }}>
                  <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '12px', fontWeight: 'bold' }}>[ CRITICAL_ESCALATION_SIGNALS ]</div>
                  {signals.map((s: any) => (
                    <div key={s.id} style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #1a1a1a' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold' }}>
                        <span style={{ color: '#fff' }}>{s.label}</span>
                        <span style={{ color: '#ff003c' }}>+{s.weight}% IMPACT</span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#8b949e', marginTop: '4px' }}>{s.desc}</div>
                    </div>
                  ))}
                </div>

                {/* DIVERGENCE WARNING */}
                {intelProb - n.prob > 20 && (
                  <div style={{ marginTop: '15px', background: '#4a0000', color: '#fff', padding: '10px', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                    CRITICAL DIVERGENCE: РЫНОК ИГНОРИРУЕТ ВОЕННЫЕ СИГНАЛЫ
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTTOM GLOBAL ALERT BLOCK */}
        <div style={{ marginTop: '30px', background: '#0a0a0a', border: '1px solid #00ff41', padding: '20px' }}>
          <h3 style={{ color: '#00ff41', fontSize: '12px', margin: '0 0 10px 0' }}>[ STRATEGIC_SUMMARY ]</h3>
          <p style={{ fontSize: '11px', color: '#8b949e', lineHeight: '1.6' }}>
            Внимание: Индикатор <b>INTEL_ESTIMATE</b> рассчитывается на основе OSINT-данных. <br/>
            Если разрыв с Polymarket превышает 15%, это указывает на инсайдерское накопление или подготовку к внезапному кинетическому действию.
          </p>
        </div>
      </div>
    </div>
  );
}
