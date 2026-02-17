'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatEngineV10() {
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const VERSION = "10.0-PRO";

  const sync = async () => {
    try {
      const res = await fetch('/api/threats');
      const data = await res.json();
      if (Array.isArray(data)) setThreats(data);
    } catch (e) { console.error("Signal Lost"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    sync();
    const interval = setInterval(sync, 10000); // 10 сек для оперативного анализа
    return () => clearInterval(interval);
  }, []);

  const globalRisk = threats.filter(t => t.prob > 0).length 
    ? Math.round(threats.reduce((a, b) => a + (b.prob || 0), 0) / threats.filter(t => t.prob > 0).length) 
    : 0;

  if (loading) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>CONNECTING_TO_GLOBAL_FEED_V{VERSION}...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      
      <div style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{fontSize:'10px'}}>STREAMS: {threats.filter(t=>t.status==='LIVE').length}/4 ACTIVE</span><br/>
          <strong>THREAT_ENGINE_V{VERSION}</strong>
        </div>
        <div style={{textAlign: 'right'}}>
          <span style={{fontSize:'10px'}}>TOTAL_AGGREGATED_RISK</span>
          <div style={{fontSize: '42px', fontWeight: 'bold', color: globalRisk > 30 ? '#f00' : '#0f0'}}>{globalRisk}%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {threats.map((t, i) => (
          <div key={i} style={{ border: '1px solid #111', background: '#050505', padding: '20px', borderLeft: `2px solid ${t.prob > 0 ? (t.prob > 35 ? '#f00' : '#0f0') : '#222'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '10px', color: t.prob > 0 ? '#0f0' : '#444' }}>[{t.status}] {t.id}</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: t.prob > 35 ? '#f00' : (t.prob > 0 ? '#0f0' : '#222') }}>
                {t.prob > 0 ? `${t.prob}%` : '---'}
              </span>
            </div>
            <div style={{ fontSize: '11px', height: '45px', color: t.prob > 0 ? '#aaa' : '#333', marginBottom: '15px' }}>{t.title}</div>
            <div style={{ height: '2px', background: '#111' }}>
              <div style={{ height: '100%', width: `${t.prob}%`, background: t.prob > 35 ? '#f00' : '#0f0', transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>

      <footer style={{marginTop:'50px', fontSize:'9px', opacity:0.4, textAlign:'center'}}>
        [SYSTEM_STABLE] // DATA_REFRESH_RATE: 10s // SOURCE: POLYMARKET_NODES_v2026
      </footer>
    </div>
  );
}
