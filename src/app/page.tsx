'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatDashboardV16() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sync = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (e) { console.error("SYNC_ERR"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    sync();
    const t = setInterval(sync, 15000);
    return () => clearInterval(t);
  }, []);

  const active = data.filter(d => d.prob > 0);
  const avgRisk = active.length ? Math.round(active.reduce((a, b) => a + b.prob, 0) / active.length) : 0;

  if (loading) return <div style={{background:'#000',color:'#0f0',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace'}}>DECRYPTING_V16_CORE...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #0f0', marginBottom: '20px' }}>
        <tbody>
          <tr>
            <td style={{ padding: '15px', border: '1px solid #0f0' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>THREAT_ENGINE_V16.0</div>
              <div style={{ fontSize: '9px', opacity: 0.5 }}>STATUS: ACTIVE // MODE: DIRECT_API_SCAN</div>
            </td>
            <td style={{ padding: '15px', border: '1px solid #0f0', textAlign: 'right', width: '200px' }}>
              <div style={{ fontSize: '10px' }}>AGGREGATED_RISK</div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: avgRisk > 35 ? '#f00' : '#0f0' }}>{avgRisk}%</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1px', background: '#0f0', border: '1px solid #0f0' }}>
        {data.map((node, i) => (
          <div key={i} style={{ background: '#000', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '10px' }}>[{node.status}] {node.id}</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: node.prob > 35 ? '#f00' : (node.prob > 0 ? '#0f0' : '#222') }}>
                {node.prob > 0 ? `${node.prob}%` : '---'}
              </span>
            </div>
            <div style={{ fontSize: '11px', height: '40px', color: node.prob > 0 ? '#ccc' : '#333', marginBottom: '15px', textTransform: 'uppercase' }}>
              {node.title}
            </div>
            <div style={{ height: '4px', background: '#111' }}>
              <div style={{ height: '100%', width: `${node.prob}%`, background: node.prob > 35 ? '#f00' : '#0f0', transition: 'width 1.5s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
