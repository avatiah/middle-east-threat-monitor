'use client';
import React, { useEffect, useState } from 'react';

export default function WarRoomV7() {
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const VERSION = "7.0-WAR-ROOM";

  const refreshData = async () => {
    try {
      const res = await fetch('/api/threats');
      const data = await res.json();
      setThreats(data);
      setLoading(false);
    } catch (e) { console.error("Sync Error"); }
  };

  useEffect(() => {
    refreshData();
    const timer = setInterval(refreshData, 20000); // 20 сек интервал для анализа
    return () => clearInterval(timer);
  }, []);

  const totalIndex = threats.length ? Math.round(threats.reduce((a, b) => a + b.prob, 0) / threats.length) : 0;

  if (loading) return (
    <div style={{background:'#000',color:'#0f0',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace'}}>
      [ V{VERSION} ] DEPLOYING_GLOBAL_SCANNER...
    </div>
  );

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      
      {/* HEADER: GLOBAL METRICS */}
      <header style={{ border: '1px solid #0f0', padding: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px' }}>SYSTEM_IDENT: THREAT_ENGINE_V{VERSION}</h1>
          <div style={{ fontSize: '10px', marginTop: '5px' }}>DATA_SOURCE: POLYMARKET_MULTI_NODE // MODE: HYBRID_SEARCH</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '10px' }}>AGGREGATED_RISK_INDEX</span>
          <div style={{ fontSize: '48px', fontWeight: 'bold', lineHeight: 1 }}>{totalIndex}%</div>
        </div>
      </header>

      {/* THREAT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {threats.map((t, i) => (
          <div key={i} style={{ border: '1px solid #111', background: '#050505', padding: '20px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '0', left: '0', height: '100%', width: '2px', background: t.prob > 30 ? '#f00' : '#0f0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '10px', color: t.status === 'ACTIVE' ? '#0f0' : '#440000' }}>
                [{t.status}] {t.id}
              </span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: t.prob > 30 ? '#f00' : '#0f0' }}>{t.prob}%</span>
            </div>

            <p style={{ fontSize: '13px', color: '#ccc', height: '40px', margin: '0 0 20px 0', textTransform: 'uppercase' }}>{t.title}</p>
            
            <div style={{ height: '2px', background: '#111', width: '100%' }}>
              <div style={{ 
                height: '100%', 
                width: `${t.prob}%`, 
                background: t.prob > 30 ? '#f00' : '#0f0', 
                boxShadow: t.prob > 30 ? '0 0 10px #f00' : 'none',
                transition: 'width 1s ease' 
              }} />
            </div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '50px', borderTop: '1px solid #111', paddingTop: '20px', fontSize: '10px', opacity: 0.5 }}>
        LATEST_SYNC: {new Date().toLocaleTimeString()} // ALL_SYSTEMS_OPERATIONAL
      </footer>
    </div>
  );
}
