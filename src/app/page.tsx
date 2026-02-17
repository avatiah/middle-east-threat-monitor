'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const VERSION = "5.0-STABLE";

  const sync = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Link lost");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sync();
    const timer = setInterval(sync, 30000);
    return () => clearInterval(timer);
  }, []);

  const totalRisk = data.length ? Math.round(data.reduce((a, b) => a + (b.prob || 0), 0) / data.length) : 0;

  if (loading) return <div style={{background:'#000',color:'#0f0',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace'}}>V{VERSION}_INITIALIZING...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #0f0', padding: '10px', marginBottom: '30px', fontSize: '12px' }}>
        <span>CORE_VERSION: {VERSION}</span>
        <span>GLOBAL_RISK: {totalRisk}%</span>
        <span style={{color: '#006600'}}>SYNC_ACTIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {data.map((t, i) => (
          <div key={i} style={{ border: '1px solid #003300', padding: '20px', background: '#050505' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', color: '#006600' }}>[{t.status}] {t.id}</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: t.prob > 40 ? '#f00' : '#0f0' }}>{t.prob}%</span>
            </div>
            <h2 style={{ fontSize: '13px', margin: '0 0 20px 0', height: '40px', lineHeight: '1.2' }}>{t.title.toUpperCase()}</h2>
            <div style={{ height: '4px', background: '#111' }}>
              <div style={{ height: '100%', width: `${t.prob}%`, background: t.prob > 40 ? '#f00' : '#0f0', transition: 'width 1.5s' }} />
            </div>
          </div>
        ))}
      </div>

      <footer style={{marginTop:'40px', fontSize:'10px', opacity:0.3, textAlign:'center'}}>
        THREAT_ENGINE_V{VERSION} // SECURE_UPLINK_READY
      </footer>
    </div>
  );
}
