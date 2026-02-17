'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatEngineV13() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (e) { console.error("Sync Error"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 20000);
    return () => clearInterval(timer);
  }, []);

  const activeNodes = data.filter(d => d.prob > 0);
  const totalRisk = activeNodes.length 
    ? Math.round(activeNodes.reduce((a, b) => a + b.prob, 0) / activeNodes.length) 
    : 0;

  if (loading) return <div style={{background:'#000',color:'#0f0',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace'}}>INITIALIZING_CORE_V13...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      
      {/* HEADER SECTION */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #0f0', marginBottom: '30px' }}>
        <tbody>
          <tr>
            <td style={{ padding: '20px', border: '1px solid #0f0' }}>
              <div style={{ fontSize: '10px', opacity: 0.5 }}>SYSTEM_STATUS: NOMINAL</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>THREAT_ENGINE_V13.0</div>
            </td>
            <td style={{ padding: '20px', border: '1px solid #0f0', textAlign: 'right', width: '200px' }}>
              <div style={{ fontSize: '10px' }}>AGGREGATED_RISK</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: totalRisk > 30 ? '#f00' : '#0f0' }}>{totalRisk}%</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* DATA GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1px', background: '#0f0', border: '1px solid #0f0' }}>
        {data.map((node, i) => (
          <div key={i} style={{ background: '#000', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '10px', color: node.prob > 0 ? '#0f0' : '#444' }}>
                [{node.status}] {node.id}
              </span>
              <span style={{ fontSize: '36px', fontWeight: 'bold', color: node.prob > 30 ? '#f00' : (node.prob > 0 ? '#0f0' : '#222') }}>
                {node.prob > 0 ? `${node.prob}%` : '---'}
              </span>
            </div>
            
            <div style={{ fontSize: '11px', height: '40px', color: node.prob > 0 ? '#ccc' : '#333', marginBottom: '20px', textTransform: 'uppercase', lineHeight: '1.4' }}>
              {node.title}
            </div>

            <div style={{ height: '4px', background: '#111' }}>
              <div style={{ 
                height: '100%', 
                width: `${node.prob}%`, 
                background: node.prob > 30 ? '#f00' : '#0f0',
                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '30px', fontSize: '10px', opacity: 0.3 }}>
        LAST_SECURE_SYNC: {new Date().toISOString()} // ALL_SYSTEMS_MONITORED
      </footer>
    </div>
  );
}
