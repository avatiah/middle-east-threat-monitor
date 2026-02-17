'use client';
import React, { useEffect, useState } from 'react';

export default function UltraMonitorV31() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  const refresh = async () => {
    try {
      const res = await fetch('/api/threats');
      const data = await res.json();
      if (Array.isArray(data)) setNodes(data);
    } catch (e) { console.error("LINK_LOST"); }
  };

  useEffect(() => {
    refresh();
    const i = setInterval(refresh, 4000);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, []);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '25px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', background: '#fff', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <b style={{ color: '#1e293b', fontSize: '20px' }}>STRATEGIC_MONITOR <span style={{color: '#3b82f6'}}>V31.0 ULTRA</span></b>
          <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>● DATA_FLOW: ENHANCED</span>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {nodes.map(n => (
            <div key={n.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                <b style={{color: '#0f172a'}}>{n.id}</b>
                <span style={{color: '#3b82f6', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px'}}>
                   {Math.floor((now - n.updated)/1000)}s ago
                </span>
              </div>
              <div style={{ fontSize: '56px', fontWeight: '800', margin: '10px 0', color: n.prob > 30 ? '#ef4444' : '#0f172a' }}>
                {n.prob}%
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px' }}>SOURCE_TYPE: {n.status}</div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '11px' }}>
                <b>VOL_USD:</b> ${n.volume}
              </div>
            </div>
          ))}
        </div>

        {/* VERIFIED WHALES SECTION */}
        <div style={{ background: '#1e293b', color: '#fff', borderRadius: '16px', padding: '25px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#3b82f6' }}>Elite Forecaster Intelligence (Verified)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <b style={{ color: '#10b981' }}>RicoSauve666</b>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Accuracy: 82.1% | Прямые позиции по Hormuz и Israel-Iran. Один из самых точных индикаторов в секторе.</p>
            </div>
            <div>
              <b style={{ color: '#10b981' }}>Rundeep</b>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Accuracy: 76.4% | Специализация на США и авиаударах. Владеет объемами более $8M.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
