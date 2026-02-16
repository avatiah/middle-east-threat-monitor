'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatEngine() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/threats');
        const data = await res.json();
        
        const formatted = data.map((m: any) => ({
          title: m.question,
          prob: Math.round(parseFloat(m.outcomePrices[0]) * 100),
          category: m.groupItemTitle || "WAR_SECTOR"
        }));
        
        setThreats(formatted);
      } catch (e) {
        console.error("Data fetch failed");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const timer = setInterval(loadData, 60000);
    return () => clearInterval(timer);
  }, []);

  const totalRisk = threats.length > 0 
    ? Math.round(threats.reduce((a, b) => a + b.prob, 0) / threats.length) 
    : 0;

  if (loading) return <div style={{background:'#000',color:'#0f0',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace'}}>_CONNECTING_TO_SATELLITE_...</div>;

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #0f0', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>THREAT_ENGINE_V3.0</h1>
        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>RISK: {totalRisk}%</div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {threats.map((t, i) => (
          <div key={i} style={{ border: '1px solid #004400', padding: '20px', background: '#050505' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', opacity: 0.5 }}>{t.category}</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: t.prob > 45 ? '#f00' : '#0f0' }}>{t.prob}%</span>
            </div>
            <h2 style={{ fontSize: '14px', height: '40px' }}>{t.title.toUpperCase()}</h2>
            <div style={{ height: '4px', background: '#111', marginTop: '15px' }}>
              <div style={{ height: '100%', width: `${t.prob}%`, background: t.prob > 45 ? '#f00' : '#0f0', transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
