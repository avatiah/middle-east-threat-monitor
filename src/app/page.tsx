'use client';
import React, { useEffect, useState } from 'react';

export default function SyntheticDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThreats = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      setData(json);
    } catch (e) { console.error("SIGNAL_LOST"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalIndex = data.length ? Math.round(data.reduce((a, b) => a + b.prob, 0) / data.length) : 0;

  if (loading) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace', letterSpacing:'5px'}}>BOOTING_SYNTHETIC_CORE_V20...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '40px', fontFamily: 'monospace', textTransform: 'uppercase' }}>
      
      {/* HEADER BAR */}
      <div style={{ borderBottom: '2px solid #0f0', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '12px', opacity: 0.6 }}>SYSTEM_ID: THREAT_ENGINE_V20.0_SYNTHETIC</div>
          <div style={{ fontSize: '42px', fontWeight: 'bold', letterSpacing: '-2px' }}>GLOBAL_WAR_INDEX</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '80px', fontWeight: 'bold', lineHeight: '0.8', color: totalIndex > 30 ? '#f00' : '#0f0' }}>{totalIndex}%</div>
          <div style={{ fontSize: '12px', marginTop: '10px' }}>AGGREGATED_THREAT_LEVEL</div>
        </div>
      </div>

      {/* MONITORING GRID */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #111' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #0f0' }}>
            <th style={{ padding: '15px' }}>SENSOR_ID</th>
            <th style={{ padding: '15px' }}>TYPE</th>
            <th style={{ padding: '15px' }}>STATUS</th>
            <th style={{ padding: '15px' }}>PROBABILITY</th>
            <th style={{ padding: '15px' }}>VISUAL_LOAD</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #111' }}>
              <td style={{ padding: '20px', fontWeight: 'bold' }}>{row.id} <br/><span style={{fontSize:'10px', opacity:0.5}}>{row.label}</span></td>
              <td style={{ padding: '20px', fontSize: '11px' }}>{row.type}</td>
              <td style={{ padding: '20px', color: '#0f0', fontSize: '11px' }}>[RECEIVING_DATA]</td>
              <td style={{ padding: '20px', fontSize: '24px', fontWeight: 'bold', color: row.prob > 30 ? '#f00' : '#0f0' }}>{row.prob}%</td>
              <td style={{ padding: '20px', width: '30%' }}>
                <div style={{ height: '8px', width: '100%', background: '#111', position: 'relative' }}>
                  <div style={{ height: '100%', width: `${row.prob}%`, background: row.prob > 30 ? '#f00' : '#0f0', boxShadow: row.prob > 30 ? '0 0 10px #f00' : 'none', transition: 'width 2s' }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FOOTER LOG */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#050505', border: '1px solid #111', fontSize: '10px', color: '#444' }}>
        {new Date().toISOString()} // STREAM_ENCRYPTED // ALL_NODES_ONLINE // NO_SILENCE_POLICY_ACTIVE
      </div>
    </div>
  );
}
