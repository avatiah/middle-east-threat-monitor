'use client';
import React, { useEffect, useState } from 'react';

export default function VerifiedEngine() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    const t = setInterval(sync, 10000);
    return () => clearInterval(t);
  }, []);

  const activeNodes = data.filter(d => d.prob > 0);
  const avgRisk = activeNodes.length ? Math.round(activeNodes.reduce((a, b) => a + b.prob, 0) / activeNodes.length) : 0;

  if (loading) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>STABILIZING_SIGNAL_V15...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      
      {/* HEADER SECTION */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #0f0', marginBottom: '40px' }}>
        <tbody>
          <tr>
            <td style={{ padding: '20px', border: '1px solid #0f0' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px' }}>THREAT_ENGINE_V15.0_FINAL</div>
              <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '5px' }}>SOURCE: POLYMARKET_GAMMA_NODE // MODE: SEMANTIC_SCAN</div>
            </td>
            <td style={{ padding: '20px', border: '1px solid #0f0', textAlign: 'right', width: '250px' }}>
              <div style={{ fontSize: '10px' }}>TOTAL_AGGREGATED_RISK</div>
              <div style={{ fontSize: '52px', fontWeight: 'bold', color: avgRisk > 30 ? '#f00' : '#0f0' }}>{avgRisk}%</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* DATA GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {data.map((node, i) => (
          <div key={i} style={{ border: '1px solid #0f0', background: '#050505', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '12px' }}>[{node.status}] {node.id}</span>
              <span style={{ fontSize: '42px', fontWeight: 'bold', color: node.prob > 30 ? '#f00' : (node.prob > 0 ? '#0f0' : '#222') }}>
                {node.prob > 0 ? `${node.prob}%` : '--'}
              </span>
            </div>
            
            <div style={{ fontSize: '11px', height: '40px', color: node.prob > 0 ? '#aaa' : '#444', marginBottom: '25px', lineHeight: '1.4' }}>
              {node.title}
            </div>

            <div style={{ height: '2px', background: '#111' }}>
              <div style={{ 
                height: '100%', 
                width: `${node.prob}%`, 
                background: node.prob > 30 ? '#f00' : '#0f0',
                boxShadow: node.prob > 30 ? '0 0 10px #f00' : 'none',
                transition: 'width 1.5s ease-in-out'
              }} />
            </div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '50px', borderTop: '1px solid #111', paddingTop: '20px', fontSize: '10px', opacity: 0.3 }}>
        SYSTEM_TIME: {new Date().toISOString()} // UPLINK: VERIFIED_STABLE
      </footer>
    </div>
  );
}
