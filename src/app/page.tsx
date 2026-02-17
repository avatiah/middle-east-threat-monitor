'use client';
import React, { useEffect, useState } from 'react';

export default function RealTimeVerifiedOS() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [timers, setTimers] = useState<Record<string, number>>({});

  const sync = async () => {
    try {
      const res = await fetch('/api/threats');
      const data = await res.json();
      if (Array.isArray(data)) {
        setNodes(data);
        const newTimers: any = {};
        data.forEach(n => { newTimers[n.id] = 0; });
        setTimers(newTimers);
      }
    } catch (e) { console.error("SYNC_FAILED"); }
  };

  useEffect(() => {
    sync();
    const mainInterval = setInterval(sync, 5000);
    const clockInterval = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => { updated[key] += 1; });
        return updated;
      });
    }, 1000);
    return () => { clearInterval(mainInterval); clearInterval(clockInterval); };
  }, []);

  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh', padding: '25px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ background: '#fff', padding: '16px 24px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <b style={{ color: '#2563eb', fontSize: '20px' }}>ThreatMarket <span style={{color: '#64748b', fontWeight: '400'}}>V30.0 CORE</span></b>
          <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>● LIVE UPDATES FROM BLOCKCHAIN</div>
        </div>

        {/* NODES GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {nodes.map(n => (
            <div key={n.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>{n.id}</span>
                <span style={{ fontSize: '11px', color: '#3b82f6', background: '#eff6ff', padding: '2px 8px', borderRadius: '8px' }}>
                  Обновлено: {timers[n.id] || 0}с назад
                </span>
              </div>
              <div style={{ fontSize: '52px', fontWeight: '800', color: n.prob === null ? '#cbd5e1' : (n.prob > 30 ? '#ef4444' : '#111827'), marginBottom: '8px' }}>
                {n.prob !== null ? `${n.prob}%` : 'NO_MARKET'}
              </div>
              <div style={{ fontSize: '14px', color: '#4b5563', marginBottom: '20px', fontWeight: '500' }}>{n.desc}</div>
              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', fontSize: '11px' }}>
                <div style={{ color: '#94a3b8', marginBottom: '4px' }}>ВЕРИФИЦИРОВАННЫЙ ЛИДЕР:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b style={{ color: '#2563eb' }}>{n.prob !== null ? n.top_holder : 'N/A'}</b>
                  <span style={{ color: '#10b981' }}>{n.prob !== null ? `Acc: ${n.accuracy}%` : ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LEADERBOARD TABLE */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#111827' }}>Elite Forecasters (Verified Addresses)</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f3f4f6', color: '#64748b', fontSize: '12px' }}>
                <th style={{ padding: '12px' }}>TRADER ADDRESS / ALIAS</th>
                <th style={{ padding: '12px' }}>HISTORICAL ACCURACY</th>
                <th style={{ padding: '12px' }}>TOTAL VOLUME CONTRIBUTION</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px', color: '#2563eb', fontWeight: 'bold' }}>RicoSauve666</td>
                <td style={{ padding: '16px' }}>82.1% (Verified)</td>
                <td style={{ padding: '16px', color: '#64748b' }}>$12,400,000+</td>
              </tr>
              <tr>
                <td style={{ padding: '16px', color: '#2563eb', fontWeight: 'bold' }}>Rundeep</td>
                <td style={{ padding: '16px' }}>76.4% (Verified)</td>
                <td style={{ padding: '16px', color: '#64748b' }}>$8,900,000+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
