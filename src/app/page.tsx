'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatEngineV8() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const VERSION = "8.0-OVERRIDE";

  const fetchData = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      setData(json);
    } catch (e) { console.error("Link unstable"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 15000);
    return () => clearInterval(t);
  }, []);

  const riskIndex = data.length ? Math.round(data.reduce((a, b) => a + b.prob, 0) / data.length) : 0;

  if (loading) return <div style={{background:'#000',color:'#0f0',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace'}}>BOOTING_V{VERSION}...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #0f0', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{fontSize:'10px', opacity:0.5}}>NODE_STATUS: ONLINE</div>
          <h1 style={{margin:0, fontSize:'24px'}}>THREAT_ENGINE_V{VERSION}</h1>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:'10px'}}>GLOBAL_AGGREGATED_RISK</div>
          <div style={{fontSize:'54px', fontWeight:'bold', lineHeight:1, color: riskIndex > 25 ? '#f00' : '#0f0'}}>{riskIndex}%</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {data.map((t, i) => (
          <div key={i} style={{ border: '1px solid #111', background: '#050505', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '10px', color: t.status === 'LIVE' ? '#0f0' : '#f00' }}>[{t.status}] {t.id}</span>
              <span style={{ fontSize: '36px', fontWeight: 'bold', color: t.prob > 30 ? '#f00' : '#0f0' }}>{t.prob}%</span>
            </div>
            <div style={{ fontSize: '12px', height: '40px', color: '#888', textTransform: 'uppercase', marginBottom: '15px' }}>{t.title}</div>
            <div style={{ height: '2px', background: '#111' }}>
              <div style={{ height: '100%', width: `${t.prob}%`, background: t.prob > 30 ? '#f00' : '#0f0', boxShadow: t.prob > 30 ? '0 0 10px #f00' : 'none' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', padding: '15px', border: '1px solid #002200', background: '#020202', fontSize: '10px', color: '#006600' }}>
        [DEBUG_LOG]: {new Date().toISOString()} - INCOMING_STREAM_DECRYPTED...<br/>
        [SENSORS]: {data.filter(d => d.status === 'LIVE').length}/{data.length} ACTIVE_NODES_FOUND
      </div>
    </div>
  );
}
