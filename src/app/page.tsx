'use client';
import React, { useEffect, useState } from 'react';

export default function EnterpriseDashboard() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const VERSION = "11.0-ENTERPRISE";

  const update = async () => {
    try {
      const res = await fetch('/api/threats');
      const data = await res.json();
      setNodes(data);
    } catch (e) { console.error("Signal Lost"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    update();
    const timer = setInterval(update, 15000);
    return () => clearInterval(timer);
  }, []);

  const activeProb = nodes.filter(n => n.prob > 0).map(n => n.prob);
  const avgRisk = activeProb.length ? Math.round(activeProb.reduce((a, b) => a + b, 0) / activeProb.length) : 0;

  if (loading) return <div style={{background:'#000',color:'#0f0',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace'}}>DECRYPTING_V{VERSION}...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      
      {/* HEADER BAR */}
      <div style={{ border: '1px solid #0f0', padding: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span style={{opacity: 0.5}}>IDENT:</span> {VERSION}<br/>
          <span style={{opacity: 0.5}}>STATUS:</span> <span style={{color: avgRisk > 30 ? '#f00' : '#0f0'}}>SYSTEM_READY</span>
        </div>
        <div style={{textAlign: 'right'}}>
          <span style={{fontSize: '10px'}}>AGGREGATED_INDEX</span>
          <div style={{fontSize: '48px', fontWeight: 'bold', color: avgRisk > 30 ? '#f00' : '#0f0'}}>{avgRisk}%</div>
        </div>
      </div>

      {/* GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ border: '1px solid #111', background: '#050505', padding: '20px', position: 'relative' }}>
            {/* Status Indicator */}
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
              <span style={{fontSize:'10px', color: n.status === 'LIVE' ? '#0f0' : '#333'}}>[{n.status}] {n.id}</span>
              <span style={{fontSize:'32px', fontWeight:'bold', color: n.prob > 30 ? '#f00' : (n.prob > 0 ? '#0f0' : '#222')}}>
                {n.prob > 0 ? `${n.prob}%` : '---'}
              </span>
            </div>
            
            <div style={{fontSize:'11px', height:'40px', color: n.prob > 0 ? '#ccc' : '#222', textTransform:'uppercase', marginBottom:'20px'}}>
              {n.title}
            </div>

            {/* Visual Bar */}
            <div style={{height:'2px', background:'#111', width:'100%'}}>
              <div style={{
                height:'100%',
                width: `${n.prob}%`,
                background: n.prob > 30 ? '#f00' : '#0f0',
                boxShadow: n.prob > 30 ? '0 0 10px #f00' : 'none',
                transition: 'width 2s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:'40px', padding:'15px', border:'1px dotted #003300', fontSize:'10px', color:'#006600'}}>
        ANALYSIS_LOG: ACTIVE_NODES:{nodes.filter(n=>n.status==='LIVE').length} | STANDBY_NODES:{nodes.filter(n=>n.status==='STANDBY').length} | LATENCY: 24ms
      </div>
    </div>
  );
}
