'use client';
import React, { useEffect, useState } from 'react';

export default function UltimateDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const VERSION = "12.0-ULTIMATE";

  const fetchStream = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      setData(json);
    } catch (e) { console.error("Uplink Lost"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStream();
    const interval = setInterval(fetchStream, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalRisk = data.length ? Math.round(data.reduce((a, b) => a + b.prob, 0) / data.length) : 0;

  if (loading) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>V{VERSION}_CONNECTING...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace', textTransform: 'uppercase' }}>
      
      {/* TOP DECK */}
      <div style={{ border: '1px solid #0f0', padding: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{fontSize: '10px', opacity: 0.6}}>CORE_SYSTEM_ACTIVE // V{VERSION}</div>
          <h1 style={{margin: 0, fontSize: '28px', letterSpacing: '3px'}}>Threat_Engine</h1>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: '10px', color: totalRisk > 30 ? '#f00' : '#0f0'}}>Aggregated_Index</div>
          <div style={{fontSize: '56px', fontWeight: 'bold', lineHeight: 1, color: totalRisk > 30 ? '#f00' : '#0f0'}}>{totalRisk}%</div>
        </div>
      </div>

      {/* SENSOR GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {data.map((s, i) => (
          <div key={i} style={{ border: '1px solid #111', background: '#050505', padding: '25px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '10px', color: s.status === 'LIVE' ? '#0f0' : '#880' }}>
                [{s.status}] {s.id}
              </span>
              <span style={{ fontSize: '42px', fontWeight: 'bold', color: s.prob > 30 ? '#f00' : '#0f0' }}>{s.prob}%</span>
            </div>
            
            <div style={{ fontSize: '12px', height: '45px', color: '#aaa', marginBottom: '20px', lineHeight: '1.4' }}>{s.title}</div>
            
            <div style={{ height: '4px', background: '#111' }}>
              <div style={{ 
                height: '100%', 
                width: `${s.prob}%`, 
                background: s.prob > 30 ? '#f00' : '#0f0',
                boxShadow: s.prob > 30 ? '0 0 15px #f00' : 'none',
                transition: 'width 1.5s ease-in-out'
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* TERMINAL FOOTER */}
      <div style={{ marginTop: '40px', padding: '15px', borderTop: '1px solid #111', fontSize: '10px', opacity: 0.5 }}>
        {new Date().toISOString()} // ALL_NODES_REPORTING // UPLINK_STABLE: 98%
      </div>
    </div>
  );
}
