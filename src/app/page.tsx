'use client';
import React, { useEffect, useState } from 'react';

export default function OmegaEngine() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const VERSION = "9.0-OMEGA";

  const sync = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (e) { console.error("LINK_ERR"); }
  };

  useEffect(() => {
    sync();
    const t = setInterval(sync, 15000);
    return () => clearInterval(t);
  }, []);

  const activeThreats = data.filter(d => d.prob > 0);
  const avgRisk = activeThreats.length 
    ? Math.round(activeThreats.reduce((a, b) => a + b.prob, 0) / activeThreats.length) 
    : 0;

  if (loading) return (
    <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>
      [ SYSTEM_BOOT_V{VERSION} ]
    </div>
  );

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '40px', fontFamily: 'monospace', boxSizing: 'border-box' }}>
      
      <header style={{ border: '1px solid #0f0', padding: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '2px' }}>THREAT_ENGINE_V{VERSION}</h1>
          <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.7 }}>CORE_STABILITY: NOMINAL // DATA_INTEGRITY: HIGH</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px' }}>TOTAL_RISK_INDEX</div>
          <div style={{ fontSize: '64px', fontWeight: 'bold', lineHeight: 1 }}>{avgRisk}%</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
        {data.map((t, i) => (
          <div key={i} style={{ border: '1px solid #111', background: '#050505', padding: '25px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: t.prob > 0 ? '#0f0' : '#200' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '10px', color: t.prob > 0 ? '#0f0' : '#400' }}>
                [{t.status}] {t.id}
              </span>
              <span style={{ fontSize: '42px', fontWeight: 'bold', color: t.prob > 30 ? '#f00' : (t.prob > 0 ? '#0f0' : '#222') }}>
                {t.prob > 0 ? `${t.prob}%` : '--'}
              </span>
            </div>

            <div style={{ fontSize: '12px', height: '40px', color: t.prob > 0 ? '#ccc' : '#333', textTransform: 'uppercase', marginBottom: '20px' }}>
              {t.title}
            </div>

            <div style={{ height: '3px', background: '#111', width: '100%' }}>
              <div style={{ 
                height: '100%', 
                width: `${t.prob}%`, 
                background: t.prob > 35 ? '#f00' : '#0f0',
                boxShadow: t.prob > 35 ? '0 0 15px #f00' : 'none',
                transition: 'width 2s cubic-bezier(0.1, 0, 0.45, 1)'
              }} />
            </div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '50px', fontSize: '10px', borderTop: '1px solid #111', paddingTop: '20px', opacity: 0.4 }}>
        SYSTEM_TIME: {new Date().toISOString()} // ALL_NODES_REPORTING
      </footer>
    </div>
  );
}
