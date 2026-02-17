'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatDashboard() {
  const [threats, setThreats] = useState<any[]>([]);
  const [status, setStatus] = useState('SYNCING');

  const sync = async () => {
    try {
      const res = await fetch('/api/threats');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setThreats(data);
      setStatus('LIVE');
    } catch (e) {
      setStatus('ERROR');
    }
  };

  useEffect(() => {
    sync();
    const timer = setInterval(sync, 45000);
    return () => clearInterval(timer);
  }, []);

  const totalRisk = threats.length > 0 
    ? Math.round(threats.reduce((a, b) => a + (b.prob || 0), 0) / threats.length) 
    : 0;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '40px', boxSizing: 'border-box' }}>
      
      {/* Исправленный блок статуса */}
      <div style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #0f0', padding: '10px 20px', marginBottom: '40px', fontSize: '12px' }}>
        <span>UPLINK: {status}</span>
        <span style={{ color: status === 'LIVE' ? '#0f0' : '#f00' }}>
          ● SIGNAL_STRENGTH: 98%
        </span>
        <span>LATENCY: 42ms</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 48px)', fontWeight: '900', margin: 0, letterSpacing: '-2px' }}>THREAT_ENGINE</h1>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px' }}>TOTAL_AGGREGATED_RISK</div>
          <div style={{ fontSize: 'clamp(40px, 8vw, 80px)', lineHeight: '1', fontWeight: 'bold' }}>{totalRisk}%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {threats.map((t, i) => (
          <div key={i} style={{ borderLeft: `4px solid ${t.prob > 40 ? '#f00' : '#0f0'}`, padding: '20px', background: '#050505', border: '1px solid #111' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '10px', color: '#004400' }}>#{t.id}</span>
              <span style={{ fontSize: '30px', fontWeight: 'bold', color: t.prob > 40 ? '#f00' : '#0f0' }}>
                {t.prob}%
              </span>
            </div>
            <h3 style={{ fontSize: '14px', height: '40px', color: '#ccc', margin: '0 0 20px 0' }}>{t.title || 'FETCHING_DATA...'}</h3>
            <div style={{ height: '2px', background: '#111', width: '100%' }}>
              <div style={{ 
                height: '100%', 
                width: `${t.prob}%`, 
                background: t.prob > 40 ? '#f00' : '#0f0', 
                transition: 'width 2s ease' 
              }} />
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
        .pulse { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
}
