'use client';
import React, { useEffect, useState } from 'react';

// Тщательно проверенные данные на текущий момент
const THREAT_CONFIG = [
  {
    id: "isr-iran",
    slug: "israel-strikes-iran-by-march-31-2026",
    title: "Удар Израиля по Ирану",
    description: "Вероятность прямой атаки ЦАХАЛ по территории Ирана до конца марта.",
    category: "ISRAEL-IRAN"
  },
  {
    id: "us-iran",
    slug: "us-strikes-iran-by-march-31-2026",
    title: "Удар США по Ирану",
    description: "Военная операция или киберудар США по объектам Ирана.",
    category: "USA-IRAN"
  },
  {
    id: "iran-isr",
    slug: "iran-strike-on-israel-by-march-31-2026",
    title: "Удар Ирана по Израилю",
    description: "Ответная атака Тегерана по израильской территории.",
    category: "IRAN-ISRAEL"
  },
  {
    id: "leb-inv",
    slug: "israeli-ground-operation-in-lebanon-by-march-31",
    title: "Операция в Ливане",
    description: "Наземная операция в Южном Ливане до конца квартала.",
    category: "LEBANON"
  }
];

export default function Home() {
  const [threats, setThreats] = useState([]);
  const [totalRisk, setTotalRisk] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.all(THREAT_CONFIG.map(async (threat) => {
          try {
            const response = await fetch(`https://gamma-api.polymarket.com/markets?slug=${threat.slug}`);
            const data = await response.json();
            if (data && data.length > 0) {
              const prob = Math.round(parseFloat(data[0].outcomePrices[0]) * 100);
              return { ...threat, prob };
            }
          } catch (e) { console.error(e); }
          return { ...threat, prob: 0 };
        }));

        setThreats(results);
        const avg = results.reduce((a, b) => a + b.prob, 0) / results.length;
        setTotalRisk(Math.round(avg));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={{backgroundColor: 'black', color: '#00ff00', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace'}}>
      _CONNECTING_TO_THREAT_DATABASE...
    </div>
  );

  return (
    <div style={{backgroundColor: 'black', color: '#cccccc', minHeight: '100vh', padding: '40px', fontFamily: 'monospace'}}>
      <div style={{maxWidth: '1000px', margin: '0 auto'}}>
        
        {/* HEADER */}
        <div style={{borderBottom: '2px solid #004400', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{color: '#00ff00', fontSize: '24px', fontWeight: 'bold', margin: 0}}>THREAT_ENGINE_V1.0</h1>
            <div style={{color: '#004400', fontSize: '10px', marginTop: '5px'}}>LIVE_GEOPOLITICAL_FEED // 2026</div>
          </div>
          <div style={{textAlign: 'right', borderLeft: '2px solid #00ff00', paddingLeft: '20px'}}>
            <div style={{fontSize: '10px', color: '#00ff00'}}>GLOBAL_RISK_INDEX</div>
            <div style={{fontSize: '48px', fontWeight: 'black', color: '#00ff00'}}>{totalRisk}%</div>
          </div>
        </div>

        {/* GRID */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
          {threats.map(threat => (
            <div key={threat.id} style={{border: '1px solid #111', padding: '20px', backgroundColor: '#050505'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                <span style={{fontSize: '10px', color: '#004400', border: '1px solid #004400', padding: '2px 5px'}}>{threat.category}</span>
                <span style={{fontSize: '20px', fontWeight: 'bold', color: threat.prob > 40 ? '#ff0000' : '#00ff00'}}>{threat.prob}%</span>
              </div>
              <h3 style={{color: 'white', marginBottom: '10px', fontSize: '16px'}}>{threat.title}</h3>
              <p style={{fontSize: '12px', color: '#666', marginBottom: '20px', height: '40px'}}>{threat.description}</p>
              
              {/* BAR */}
              <div style={{height: '4px', backgroundColor: '#111', width: '100%'}}>
                <div style={{height: '100%', width: `${threat.prob}%`, backgroundColor: threat.prob > 40 ? '#ff0000' : '#00ff00', transition: 'width 1s ease'}}></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
