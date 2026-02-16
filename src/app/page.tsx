'use client';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/threats');
        const data = await res.json();
        
        const formatted = data.map((m: any) => ({
          title: m.question,
          prob: Math.round(parseFloat(m.outcomePrices[0]) * 100),
          category: m.groupItemTitle || "GEOPOLITICS"
        }));
        
        setThreats(formatted);
      } catch (e) {
        console.error("Error loading data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">_SYNCING_WITH_SATELLITE_...</div>;

  const totalRisk = threats.length > 0 
    ? Math.round(threats.reduce((a, b) => a + b.prob, 0) / threats.length) 
    : 0;

  return (
    <main style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #004400', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>THREAT_ENGINE_V2.0</h1>
        <div style={{ fontSize: '24px' }}>INDEX: {totalRisk}%</div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {threats.map((t, i) => (
          <div key={i} style={{ border: '1px solid #004400', padding: '20px', background: '#050505' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', opacity: 0.5 }}>{t.category}</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: t.prob > 40 ? '#f00' : '#0f0' }}>{t.prob}%</span>
            </div>
            <h2 style={{ fontSize: '16px', textTransform: 'uppercase' }}>{t.title}</h2>
            <div style={{ height: '4px', background: '#111', marginTop: '15px' }}>
              <div style={{ height: '100%', width: `${t.prob}%`, background: t.prob > 40 ? '#f00' : '#0f0', transition: 'width 1.5s ease-in-out' }} />
            </div>
          </div>
        ))}
      </div>
      
      <footer style={{ marginTop: '50px', fontSize: '10px', opacity: 0.3, textAlign: 'center' }}>
        DATA_SOURCE: POLYMARKET_NODES // ENCRYPTED_STREAM_ON
      </footer>
    </main>
  );
}
