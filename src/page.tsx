'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatEngine() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetch('/api/threats');
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      const formatted = data.map((m: any) => ({
        title: m.question || "Unknown Threat",
        prob: Math.round(parseFloat(m.outcomePrices?.[0] || "0") * 100),
        category: m.groupItemTitle || "WAR_SECTOR"
      }));
      
      setThreats(formatted);
    } catch (e) {
      console.error("Sync error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 60000); // Обновление раз в минуту
    return () => clearInterval(timer);
  }, []);

  // Безопасный расчет индекса без NaN
  const totalRisk = threats.length > 0 
    ? Math.round(threats.reduce((acc, curr) => acc + (curr.prob || 0), 0) / threats.length) 
    : 0;

  if (loading) return (
    <div style={{background:'#000',color:'#0f0',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace'}}>
      [ CONNECTING_TO_SATELLITE_NETWORK... ]
    </div>
  );

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #0f0', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>THREAT_ENGINE_V3.0</h1>
          <div style={{ fontSize: '10px', color: '#006600' }}>GEOPOLITICAL_DATALINK_STABLE</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px' }}>GLOBAL_RISK</div>
          <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{totalRisk}%</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {threats.map((t, i) => (
          <div key={i} style={{ border: '1px solid #004400', padding: '20px', background: '#050505' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', opacity: 0.5 }}>{t.category}</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: t.prob > 45 ? '#f00' : '#0f0' }}>{t.prob}%</span>
            </div>
            <h2 style={{ fontSize: '14px', height: '40px', textTransform: 'uppercase' }}>{t.title}</h2>
            <div style={{ height: '4px', background: '#111', marginTop: '15px' }}>
              <div style={{ height: '100%', width: `${t.prob}%`, background: t.prob > 45 ? '#f00' : '#0f0', transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>
      
      <footer style={{ marginTop: '50px', fontSize: '9px', color: '#003300', textAlign: 'center' }}>
        SOURCE: POLYMARKET_GAMMA_NODE // ENCRYPTED_FEED_ON
      </footer>
    </div>
  );
}
