'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatDashboard() {
  const [threats, setThreats] = useState([]);
  const [status, setStatus] = useState('SYNCING');

  const sync = async () => {
    try {
      const res = await fetch('/api/threats');
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

  const globalRisk = threats.length > 0 
    ? Math.round(threats.reduce((a, b) => a + (b.prob || 0), 0) / threats.length) 
    : '---';

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '40px' }}>
      {/* КРЕАТИВНЫЙ БЛОК: СТАТУС СИСТЕМЫ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #0f0', padding: '10px 20px', marginBottom: '40px', fontSize: '12px' }}>
        <span>UPLINK: {status}</span>
        <span style={{ animatePulse: 'true' }}>● SIGNAL_STRENGTH: 98%</span>
        <span>LATENCY: 42ms</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: 0, letterSpacing: '-2px' }}>THREAT_ENGINE</h1>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px' }}>TOTAL_AGGREGATED_RISK</div>
          <div style={{ fontSize: '5rem', lineHeight: '1', fontWeight: 'bold' }}>{globalRisk}%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {threats.map((t, i) => (
          <div key={i} style={{ borderLeft: `4px solid ${t.prob > 40 ? '#f00' : '#0f0'}`, padding: '20px', background: '#050505' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '10px', color: '#004400' }}>#{t.id}</span>
              <span style={{ fontSize: '30px', fontWeight: 'bold', color: t.prob > 40 ? '#f00' : '#0f0' }}>
                {t.prob === 0 && !t.title ? '[OFFLINE]' : `${t.prob}%`}
              </span>
            </div>
            <h3 style={{ fontSize: '14px', height: '40px', color: '#ccc' }}>{t.title || 'RECONNECTING_TO_NODE...'}</h3>
            <div style={{ height: '2px', background: '#111', width: '100%', marginTop: '20px' }}>
              <div style={{ 
                height: '100%', 
                width: `${t.prob}%`, 
                background: t.prob > 40 ? '#f00' : '#0f0', 
                boxShadow: t.prob > 40 ? '0 0 15px #f00' : 'none',
                transition: 'width 2s ease' 
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
