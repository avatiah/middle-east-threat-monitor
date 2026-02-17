'use client';
import React, { useEffect, useState } from 'react';

export default function ResilientIntelOS() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState("CONNECTING...");

  const update = async () => {
    try {
      const res = await fetch('/api/threats');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setNodes(data);
      setSyncStatus(`ONLINE: ${new Date().toLocaleTimeString()}`);
    } catch (e) {
      setSyncStatus("RECONNECTING...");
    }
  };

  useEffect(() => { update(); const i = setInterval(update, 5000); return () => clearInterval(i); }, []);

  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      
      {/* HEADER */}
      <div style={{ border: '2px solid #0f172a', padding: '15px', background: '#fff', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <b style={{ fontSize: '18px' }}>INTEL_STREAM_V26.1 // RESILIENT</b>
          <span style={{ color: syncStatus.includes('ONLINE') ? '#10b981' : '#ef4444' }}>{syncStatus}</span>
        </div>
      </div>

      {/* NODES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '11px', opacity: 0.5 }}>SIGNAL: {n.id}</div>
            <div style={{ fontSize: '54px', fontWeight: 'bold', color: n.status === 'LIVE' ? '#3b82f6' : '#cbd5e1' }}>
              {n.prob}%
            </div>
            <div style={{ fontSize: '12px', marginTop: '10px' }}><b>СРОК:</b> {n.timeframe}</div>
            <div style={{ fontSize: '10px', background: '#f1f5f9', padding: '5px', marginTop: '10px' }}>
              STATUS: {n.status} | VOL: ${Math.round(n.volume).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#64748b', background: '#fff', padding: '15px', border: '1px solid #e2e8f0' }}>
        <b>ИНФО:</b> Если на узле 0% и статус OFFLINE — это значит, что рынок на Polymarket закрыт или API временно не выдает этот конкретный токен. 
        Система больше не использует статические данные из памяти.
      </div>
    </div>
  );
}
