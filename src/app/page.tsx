'use client';
import React, { useEffect, useState } from 'react';

export default function PolymarketStyleOS() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  const sync = async () => {
    const res = await fetch('/api/threats');
    const data = await res.json();
    if (Array.isArray(data)) setNodes(data);
  };

  useEffect(() => { 
    sync(); 
    const i = setInterval(sync, 2000); 
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* NAVBAR STYLE */}
      <div style={{ background: '#fff', padding: '15px 30px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '50%' }}></div>
          <b style={{ fontSize: '20px', color: '#0f172a' }}>ThreatMarket <span style={{color: '#64748b', fontWeight: 'normal'}}>V28.0</span></b>
        </div>
        <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>● LIVE_DATA_STREAM</div>
      </div>

      {/* NODES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', transition: 'transform 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{n.id}</span>
              <span style={{ fontSize: '11px', color: '#3b82f6', background: '#eff6ff', padding: '2px 8px', borderRadius: '10px' }}>
                Обновлено: {Math.floor((now - n.updated_at) / 1000)} сек. назад
              </span>
            </div>
            
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>{n.prob}%</div>
            
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '20px', height: '32px' }}>{n.detail}</div>
            
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px' }}>ТОП-ТРЕЙДЕР:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <b style={{ fontSize: '13px', color: '#2563eb' }}>{n.top_trader.name}</b>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>WinRate: {n.top_trader.win_rate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TOP TRADERS PROFILE TABLE */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '25px' }}>
        <h2 style={{ marginTop: 0, fontSize: '18px', marginBottom: '20px' }}>Elite Forecasters // Точность прогнозов</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f3f4f6', color: '#64748b', fontSize: '13px' }}>
              <th style={{ padding: '10px' }}>ТРЕЙДЕР</th>
              <th style={{ padding: '10px' }}>ИСТОРИЧЕСКАЯ ТОЧНОСТЬ</th>
              <th style={{ padding: '10px' }}>ПРОФИТ</th>
              <th style={{ padding: '10px' }}>СПЕЦИАЛИЗАЦИЯ</th>
            </tr>
          </thead>
          <tbody>
            {nodes.slice(0, 2).map((n, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', fontSize: '14px' }}>
                <td style={{ padding: '15px' }}><b style={{ color: '#2563eb' }}>{n.top_trader.name}</b></td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '100px', height: '6px', background: '#f3f4f6', borderRadius: '3px' }}>
                      <div style={{ width: `${n.top_trader.win_rate}%`, height: '100%', background: '#10b981', borderRadius: '3px' }}></div>
                    </div>
                    <b>{n.top_trader.win_rate}%</b>
                  </div>
                </td>
                <td style={{ padding: '15px', color: '#10b981' }}>{n.top_trader.total_profit}</td>
                <td style={{ padding: '15px', color: '#64748b' }}>{n.top_trader.history}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
