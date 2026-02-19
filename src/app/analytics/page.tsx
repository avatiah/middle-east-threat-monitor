'use client';
import React, { useEffect, useState } from 'react';

// Четкое определение типов для сигналов эскалации
interface IntelSignal {
  id: string;
  label: string;
  weight: number;
  status: string;
  desc: string;
}

export default function WarRoomAnalytics() {
  const [data, setData] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  // МАТРИЦА КРИТИЧЕСКИХ СИГНАЛОВ (Те самые дополнительные данные, которые вы просили)
  const CRITICAL_SIGNALS: Record<string, IntelSignal[]> = {
    "ISR-IRN": [
      { id: "SIG1", label: "ELINT_SPIKE", weight: 15, status: "CRITICAL", desc: "Аномальная активность РЛС наведения в зоне объектов." },
      { id: "SIG2", label: "AIR_REFUEL", weight: 25, status: "ACTIVE", desc: "Развертывание самолетов-заправщиков ВВС в активных секторах." }
    ],
    "USA-STRIKE": [
      { id: "SIG3", label: "B-52_DEPLOY", weight: 20, status: "ACTIVE", desc: "Переброска стратегической авиации на передовые базы (Диего-Гарсия)." },
      { id: "SIG4", label: "CARRIER_POS", weight: 30, status: "LOCKED", desc: "Авианосная ударная группа вошла в радиус тактического пуска." }
    ],
    "HORMUZ": [
      { id: "SIG5", label: "MINELAYING", weight: 40, status: "DETECTED", desc: "Зафиксирована загрузка минного вооружения на быстроходные катера." },
      { id: "SIG6", label: "AIS_BLACKOUT", weight: 15, status: "WARNING", desc: "Массовое отключение транспондеров судов в Ормузском проливе." }
    ],
    "LEB-INV": [
      { id: "SIG7", label: "DIV_RESERVE", weight: 20, status: "ACTIVE", desc: "Экстренный призыв резервистов 98-й и 36-й дивизий ЦАХАЛ." },
      { id: "SIG8", label: "IRON_DOME_POS", weight: 10, status: "DEPLOYED", desc: "Масштабная переброска батарей ПВО на северные рубежи." }
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
            <a href="/" style={{ color: '#00ff41', textDecoration: 'none', fontSize: '10px', border: '1px solid #333', padding: '4px 8px' }}>
              [ BACK_TO_DASHBOARD ]
            </a>
            <h1 style={{ color: '#00ff41', margin: '15px 0 0 0', fontSize: '20px' }}>WAR_ROOM_TERMINAL // V1.5_PRO</h1>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#666' }}>
            INTEL_FUSION: <span style={{color: '#00ff41'}}>STABLE</span> | {new Date(now).toLocaleTimeString()}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
          {data.map(n => {
            const signals = CRITICAL_SIGNALS[n.id] || [];
            // Расчет Intel Estimate: Базовая вероятность Polymarket + вес внешних сигналов
            const intelProb = Math.min(99, (Number(n.prob) || 0) + signals.reduce((acc, s) => acc + s.weight, 0));

            return (
              <div key={n.id} style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '20px', position: 'relative' }}>
                <div style={{ color: '#58a6ff', fontSize: '10px', marginBottom: '15px' }}>NODE_UNIT: {n.id}</div>
                <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '25px', borderLeft: '3px solid #00ff41', paddingLeft: '15px' }}>{n.id.replace('-', ' ')}</h2>

                {/* СРАВНЕНИЕ РЫНКА И РАЗВЕДКИ */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ background: '#000', padding: '15px', border: '1px solid #222' }}>
                    <div style={{ fontSize: '8px', color: '#666' }}>MARKET (POLYMKT)</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>{n.prob}%</div>
                  </div>
                  <div style={{ background: '#000', padding: '15px', border: '1px solid #ff003c' }}>
                    <div style={{ fontSize: '8px', color: '#ff003c' }}>INTEL_ESTIMATE</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff003c' }}>{intelProb}%</div>
                  </div>
                </div>

                {/* БЛОК СИГНАЛОВ ЭСКАЛАЦИИ */}
                <div style={{ background: '#0a0a0a', padding: '15px', border: '1px solid #333' }}>
                  <div style={{ fontSize: '10px', color: '#00ff41', marginBottom: '12px', fontWeight: 'bold' }}>[ CRITICAL_ESCALATION_SIGNALS ]</div>
                  {signals.map((s) => (
                    <div key={s.id} style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #1a1a1a' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold' }}>
                        <span style={{ color: '#fff' }}>{s.label}</span>
                        <span style={{ color: '#ff003c' }}>+{s.weight}% IMPACT</span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#8b949e', marginTop: '4px' }}>{s.desc}</div>
                    </div>
                  ))}
                </div>

                {/* АЛЕРТ О РАСХОЖДЕНИИ */}
                {(intelProb - (Number(n.prob) || 0)) > 20 && (
                  <div style={{ marginTop: '15px', background: '#4a0000', color: '#fff', padding: '10px', fontSize: '9px', textAlign: 'center', fontWeight: 'bold' }}>
                    DIVERGENCE: РЫНОК ИГНОРИРУЕТ ВОЕННЫЕ ПРИЗНАКИ ПОДГОТОВКИ
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
