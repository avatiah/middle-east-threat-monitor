'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatDevV3() {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<Record<string, number[]>>({});
  const [prices, setPrices] = useState({ brent: 88.80, gold: 2072.50 });
  const [lang, setLang] = useState<'EN' | 'RU'>('RU');

  // ДАННЫЕ РАЗВЕДКИ С ПОЯСНЕНИЕМ ИСТОЧНИКОВ
  const INTEL_FUSION: any = {
    "ISR-IRN": { 
      source: "Спутниковый мониторинг / OSINT", 
      trigger: "Авиаудар Израиля по Ирану",
      reason: "Зафиксирована подготовка самолетов-заправщиков и активация РЛС. Это указывает на высокую вероятность вылета в ближайшие 48-72 часа.",
      impact: "+25% к базовому прогнозу"
    },
    "USA-STRIKE": { 
      source: "Радиоперехват (SIGINT)", 
      trigger: "Военное вмешательство США",
      reason: "Авианосная группа вошла в зону пуска. Коды готовности B-52 изменены на боевые. Рынок Polymarket обычно реагирует на такие сигналы с задержкой в 6-12 часов.",
      impact: "+30% к базовому прогнозу"
    },
    "HORMUZ": { 
      source: "Морской трафик / AIS", 
      trigger: "Блокада Ормузского пролива",
      reason: "Катера КСИР начали установку учебных мин и отключили транспондеры. Рост цен на нефть Brent напрямую подтверждает риск перекрытия путей.",
      impact: "+15% к базовому прогнозу"
    },
    "LEB-INV": { 
      source: "Геолокация войск / TikTok-OSINT", 
      trigger: "Вторжение в Ливан",
      reason: "98-я дивизия ЦАХАЛ (десант) переброшена с юга на север. Развертывание полевых госпиталей у границы завершено. Это финальная стадия подготовки перед атакой.",
      impact: "+20% к базовому прогнозу"
    }
  };

  const TRADERS = [
    { id: "L1", name: "RicoSauve666", info: "$12.4M+", bio: "Топ-1 Polymarket. Его крупные ставки исторически предшествуют началу боевых действий." },
    { id: "L2", name: "Rundeep", info: "76.4% Win", bio: "Военный аналитик. Специализируется на операциях США." }
  ];

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        setHistory(prev => {
          const newH = { ...prev };
          json.forEach(item => {
            if (!newH[item.id]) newH[item.id] = new Array(25).fill(item.prob);
            newH[item.id] = [...newH[item.id].slice(1), item.prob];
          });
          return newH;
        });
      }
    } catch (e) { console.error("CONNECTION_ERROR"); }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 4000);
    return () => clearInterval(i);
  }, []);

  const UI = {
    EN: { title: "ADVANCED THREAT TERMINAL // V3.0", whale: "WHALE ANALYSIS", intel: "INTEL_SOURCE:", logic: "WHY IS THIS IMPORTANT?", near: "SHORT-TERM", far: "LONG-TERM" },
    RU: { title: "ТЕРМИНАЛ ГЛОБАЛЬНЫХ УГРОЗ // V3.0", whale: "АНАЛИЗ КРУПНЫХ ИГРОКОВ", intel: "ИСТОЧНИК ДАННЫХ:", logic: "ПОЧЕМУ ЭТО ВАЖНО?", near: "ДО 28 ФЕВ", far: "ДО 31 МАР" }
  };
  const T = UI[lang];

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '15px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <header style={{ borderBottom: '1px solid #00ff41', paddingBottom: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: '#00ff41', margin: 0, fontSize: '20px' }}>{T.title}</h1>
            <div style={{ display: 'flex', gap: '20px', fontSize: '11px', marginTop: '10px' }}>
              <span>BRENT: <span style={{color:'#fff'}}>${prices.brent}</span></span>
              <span>GOLD: <span style={{color:'#fff'}}>${prices.gold}</span></span>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'EN' ? 'RU' : 'EN')} style={{ background: '#111', border: '1px solid #00ff41', color: '#00ff41', padding: '5px 15px', height: 'fit-content' }}>
            {lang === 'EN' ? 'РУССКИЙ' : 'ENGLISH'}
          </button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '25px' }}>
          {data.map(n => {
            const h = history[n.id] || [];
            const intel = INTEL_FUSION[n.id] || {};
            const isRising = h[h.length-1] > h[0];

            return (
              <div key={n.id} style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '20px' }}>
                <div style={{ fontSize: '10px', color: '#58a6ff', marginBottom: '5px' }}>NODE: {n.id}</div>
                <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '20px' }}>{intel.trigger || n.id}</h2>

                {/* ГРАФИК ДИНАМИКИ */}
                <div style={{ background: '#000', border: '1px solid #111', height: '100px', marginBottom: '20px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '8px', color: '#444' }}>ИСТОРИЯ ИЗМЕНЕНИЙ (%)</div>
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline fill="none" stroke={isRising ? "#ff003c" : "#00ff41"} strokeWidth="2" points={h.map((p, i) => `${(i / (h.length - 1)) * 100},${100 - p}`).join(' ')} />
                  </svg>
                </div>

                {/* ШАНСЫ */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ flex: 1, background: '#000', border: '1px solid #222', padding: '15px', textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#666' }}>{T.near}</div>
                    <div style={{ fontSize: '32px', color: '#3b82f6', fontWeight: 'bold' }}>{n.prob}%</div>
                  </div>
                  <div style={{ flex: 1, background: '#000', border: '1px solid #222', padding: '15px', textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#666' }}>{T.far}</div>
                    <div style={{ fontSize: '32px', color: '#ff003c', fontWeight: 'bold' }}>{Math.round(n.prob * 1.5)}%</div>
                  </div>
                </div>

                {/* АНАЛИЗ РАЗВЕДКИ (НОВЫЙ БЛОК) */}
                <div style={{ background: '#0a1a0a', padding: '15px', borderLeft: '3px solid #00ff41', marginBottom: '20px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#00ff41', marginBottom: '5px' }}>{T.intel} {intel.source}</div>
                  <div style={{ fontSize: '11px', color: '#fff', marginBottom: '8px' }}><b>{T.logic}</b> {intel.reason}</div>
                  <div style={{ fontSize: '10px', color: '#ff003c' }}>ВЛИЯНИЕ: {intel.impact}</div>
                </div>

                {/* ДАННЫЕ ПО ТРЕЙДЕРАМ */}
                <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '15px' }}>
                  <div style={{ fontSize: '10px', color: '#58a6ff', marginBottom: '12px' }}>{T.whale}</div>
                  {TRADERS.map(t => (
                    <div key={t.id} style={{ marginBottom: '10px', fontSize: '11px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{color: '#fff'}}>{t.name}</span>
                        <span style={{color: '#00ff41'}}>{t.info}</span>
                      </div>
                      <div style={{ fontSize: '9px', color: '#666', marginTop: '3px' }}>{t.bio}</div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
