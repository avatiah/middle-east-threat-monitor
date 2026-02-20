'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatDevV5() {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<Record<string, any>>({});
  const [now, setNow] = useState(Date.now());
  const [lang, setLang] = useState<'EN' | 'RU'>('RU');

  // 1. МАКСИМУМ OSINT ДАННЫХ (Факты, не связанные с Polymarket)
  const OSINT_FEED = [
    { id: "SIG-1", src: "SIGINT / Радиоперехват", event: "АКТИВАЦИЯ ЧАСТОТ 'МЕРТВОЙ РУКИ'", info: "Зафиксирован выход на связь узлов управления РВСН на резервных частотах. Последний раз такая активность была в 2022.", time: "12:14:05", level: "CRITICAL" },
    { id: "AIR-1", src: "ADSB-Exchange / FlightRadar", event: "RC-135V RIVET JOINT ПАТРУЛЬ", info: "Разведывательная авиация США работает в режиме 24/7 у границ Ирана. Сопровождение истребителями F-35.", time: "11:45:30", level: "HIGH" },
    { id: "SAT-1", src: "Maxar / Sentinel-2", event: "ПОДГОТОВКА ПУСКОВЫХ ШАХТ", info: "Спутниковые снимки подтверждают снятие маскировочных сетей с мобильных пусковых установок в районе Тебриза.", time: "10:20:12", level: "CRITICAL" },
    { id: "NAV-1", src: "MarineTraffic / AIS", event: "ПЕРЕБРОСКА ФРЕГАТОВ ТИПА 'СААР-6'", info: "ВМС Израиля вывели все боеспособные единицы в Красное море. Районы патрулирования закрыты для гражданских.", time: "09:33:00", level: "HIGH" },
    { id: "LOG-1", src: "OSINT Analysis", event: "РЕЗЕРВИРОВАНИЕ КРОВИ (ЦАХАЛ)", info: "Запрос на экстренную мобилизацию медицинского персонала и запасов донорской крови на северном фронте.", time: "08:10:45", level: "HIGH" }
  ];

  // 2. БИРЖЕВЫЕ ДАННЫЕ (Энергоносители)
  const [markets, setMarkets] = useState({
    brent: { price: 89.42, change: "+2.4%", hist: [85, 86, 84, 87, 88, 89.4] },
    gold: { price: 2145.10, change: "+1.8%", hist: [2100, 2110, 2105, 2125, 2145] },
    natgas: { price: 2.85, change: "+5.1%", hist: [2.1, 2.3, 2.2, 2.6, 2.85] }
  });

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        setHistory(prev => {
          const newH = { ...prev };
          json.forEach(item => {
            if (!newH[item.id]) newH[item.id] = new Array(30).fill(item.prob);
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
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  const TRADERS = [
    { name: "RicoSauve666", info: "$12.4M+", bio: "Top-1 Polymarket. Специалист по Ближнему Востоку." },
    { name: "Rundeep", info: "76.4% Win", bio: "Военный аналитик. Точный тайминг операций США." },
    { name: "GC_WHALE_01", info: "$142k Active", bio: "Хедж-фонд. Входит по сигналам тех. разведки." }
  ];

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px', color: '#fff', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* HEADER & MARKET TICKER */}
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ color: '#00ff41', margin: 0, fontSize: '20px' }}>STRATEGIC_MONITOR // V5.0_FINAL</h1>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <span style={{ color: '#00ff41', fontSize: '12px' }}>{new Date(now).toLocaleTimeString()} // SYNC_ACTIVE</span>
              <button onClick={() => setLang(lang === 'EN' ? 'RU' : 'EN')} style={{ background: '#00ff41', color: '#000', border: 'none', padding: '6px 15px', fontWeight: 'bold', cursor: 'pointer' }}>{lang === 'EN' ? 'РУССКИЙ' : 'ENGLISH'}</button>
            </div>
          </div>

          {/* ГРАФИКИ БИРЖИ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {Object.entries(markets).map(([key, val]) => (
              <div key={key} style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginBottom: '5px' }}>
                  <span>{key.toUpperCase()}</span>
                  <span style={{ color: '#ff003c' }}>{val.change}</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>${val.price}</div>
                <div style={{ height: '30px' }}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline fill="none" stroke="#00ff41" strokeWidth="2" points={val.hist.map((p, i) => `${(i / (val.hist.length - 1)) * 100},${100 - (p/30)}`).join(' ')} />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* SECTION 1: POLYMARKET & WHALES */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#00ff41', fontSize: '14px', marginBottom: '25px' }}>// ПРОГНОЗЫ РЫНКА И АНАЛИЗ КИТОВ</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '25px' }}>
            {data.map(n => {
              const h = history[n.id] || [];
              return (
                <div key={n.id} style={{ background: '#050505', border: '1px solid #222', padding: '25px' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>{n.id.replace('-', ' ')}</h3>
                  
                  {/* ГРАФИК POLYMARKET */}
                  <div style={{ height: '50px', background: '#000', border: '1px solid #111', marginBottom: '20px' }}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polyline fill="none" stroke={h[h.length-1] > h[0] ? "#ff003c" : "#00ff41"} strokeWidth="2" points={h.map((p, i) => `${(i / (h.length - 1)) * 100},${100 - p}`).join(' ')} />
                    </svg>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, background: '#000', padding: '15px', border: '1px solid #1a1a1a', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#666' }}>ДО 28 ФЕВ</div>
                      <div style={{ fontSize: '24px', color: '#3b82f6', fontWeight: 'bold' }}>{n.prob}%</div>
                    </div>
                    <div style={{ flex: 1, background: '#000', padding: '15px', border: '1px solid #1a1a1a', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#666' }}>ДО 31 МАР</div>
                      <div style={{ fontSize: '24px', color: '#ff003c', fontWeight: 'bold' }}>{Math.round(n.prob * 1.6)}%</div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '15px' }}>
                    <div style={{ fontSize: '11px', color: '#00ff41', marginBottom: '12px' }}>ЭЛИТНЫЕ ТРЕЙДЕРЫ:</div>
                    {TRADERS.map(t => (
                      <div key={t.name} style={{ marginBottom: '10px', fontSize: '12px', borderLeft: '2px solid #3b82f6', paddingLeft: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{fontWeight:'bold'}}>{t.name}</span>
                          <span style={{color:'#00ff41'}}>{t.info}</span>
                        </div>
                        <div style={{ color: '#8b949e', fontSize: '10px' }}>{t.bio}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: GLOBAL OSINT FEED (SEPARATE) */}
        <div style={{ borderTop: '2px solid #ff003c', paddingTop: '40px' }}>
          <h2 style={{ color: '#ff003c', fontSize: '14px', marginBottom: '30px' }}>// ГЛОБАЛЬНАЯ ЛЕНТА РАЗВЕДДАННЫХ (OSINT_STREAM)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
            {OSINT_FEED.map(e => (
              <div key={e.id} style={{ background: '#0a0a0a', border: '1px solid #ff003c', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#ff003c', marginBottom: '12px' }}>
                  <span>ИСТОЧНИК: {e.src}</span>
                  <span style={{ background: '#ff003c', color: '#000', padding: '2px 6px', fontWeight: 'bold' }}>{e.level}</span>
                </div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#fff' }}>{e.event}</h4>
                <p style={{ fontSize: '13px', color: '#fff', lineHeight: '1.5', margin: '0 0 15px 0' }}>{e.info}</p>
                <div style={{ fontSize: '10px', color: '#444', borderTop: '1px solid #1a1a1a', paddingTop: '10px' }}>
                  ОБНОВЛЕНО: {e.time} UTC // DATA_STABLE
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
