'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatEngineV6() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const VERSION = "6.0-ULTRA";

  const update = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      setData(json);
    } catch (e) { console.error("Update failed"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  const totalRisk = data.length ? Math.round(data.reduce((a, b) => a + b.prob, 0) / data.length) : 0;

  if (loading) return (
    <div style={{background:'#000',color:'#0f0',height:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'monospace'}}>
      <div className="pulse">ESTABLISHING_MULTIPLE_UPLINKS_V{VERSION}...</div>
    </div>
  );

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '25px', fontFamily: 'monospace', boxSizing: 'border-box' }}>
      
      <div style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
        <div>
          <span style={{opacity: 0.5}}>SYSTEM_IDENT:</span> THREAT_ENGINE_V{VERSION}<br/>
          <span style={{opacity: 0.5}}>STATUS:</span> {totalRisk > 30 ? 'ELEVATED_RISK' : 'MONITORING'}
        </div>
        <div style={{textAlign: 'right'}}>
          <span style={{fontSize: '10px'}}>AGGREGATED_THREAT_INDEX</span>
          <div style={{fontSize: '48px', fontWeight: 'bold', lineHeight: '1'}}>{totalRisk}%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
        {data.map((t, i) => (
          <div key={i} style={{ border: '1px solid #111', borderLeft: `3px solid ${t.prob > 35 ? '#f00' : '#0f0'}`, padding: '20px', background: '#050505' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '10px', color: t.status === 'ACTIVE' ? '#0f0' : '#440000' }}>● {t.status}::{t.id}</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: t.prob > 35 ? '#f00' : '#0f0' }}>{t.prob}%</span>
            </div>
            <div style={{ fontSize: '13px', height: '45px', marginBottom: '20px', color: '#ccc', textTransform: 'uppercase' }}>{t.title}</div>
            <div style={{ height: '2px', background: '#111' }}>
              <div style={{ height: '100%', width: `${t.prob}%`, background: t.prob > 35 ? '#f00' : '#0f0', boxShadow: t.prob > 35 ? '0 0 10px #f00' : 'none', transition: 'width 2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
        .pulse { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
}
