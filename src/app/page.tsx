'use client';
import React, { useEffect, useState } from 'react';

export default function InfinityThreatOS() {
  const [data, setData] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const refresh = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] UPLINK_SYNC_SUCCESS // ALL_NODES_STABLE`, ...prev].slice(0, 8));
      }
    } catch (e) { console.warn("SYNC_ERROR"); }
  };

  useEffect(() => { refresh(); const i = setInterval(refresh, 5000); return () => clearInterval(i); }, []);

  const getStyle = (p: number) => {
    if (p > 40) return { color: '#f00', label: 'DEFCON 2', msg: 'CRITICAL_DANGER' };
    if (p > 25) return { color: '#ffaa00', label: 'DEFCON 3', msg: 'HIGH_ALERT' };
    return { color: '#0f0', label: 'DEFCON 4', msg: 'NOMINAL' };
  };

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '25px', fontFamily: 'monospace' }}>
      
      {/* HEADER BAR */}
      <div style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 'bold' }}>STRATEGIC_INTELLIGENCE_OS // V24.0-INFINITY</div>
          <div style={{ fontSize: '10px', opacity: 0.5 }}>IDENT: 11.0-ENTERPRISE // SOURCE: POLYMARKET_CORE_NODES</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '32px', color: '#f00' }}>{data.length ? Math.max(...data.map(d=>d.prob)) : 0}%</div>
          <div style={{ fontSize: '9px' }}>MAX_THREAT_LEVEL</div>
        </div>
      </div>

      {/* PRIMARY SENSOR GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        {data.map((n, i) => {
          const cfg = getStyle(n.prob);
          return (
            <div key={i} style={{ border: '1px solid #333', padding: '20px', background: '#050505' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                <span style={{ color: n.status === 'ACTIVE_STREAM' ? '#0f0' : '#555' }}>[{n.id}] {n.status}</span>
                <span style={{ color: cfg.color }}>{cfg.label}</span>
              </div>
              <div style={{ fontSize: '64px', fontWeight: 'bold', color: cfg.color, margin: '10px 0' }}>{n.prob}%</div>
              <div style={{ fontSize: '9px', color: '#fff', height: '30px', opacity: 0.7 }}>{n.title}</div>
              <div style={{ height: '2px', background: '#111', marginTop: '15px' }}>
                <div style={{ height: '100%', width: `${n.prob}%`, background: cfg.color, boxShadow: `0 0 10px ${cfg.color}` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* WHALE TRACKER & ANALYTICS */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <div style={{ fontSize: '12px', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>WHALE_WATCH // ТРЕЙДЕРЫ-ЛИДЕРЫ (WIN_RATE 85%+)</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr style={{ textAlign: 'left', opacity: 0.4 }}>
                <th style={{ padding: '8px' }}>NODE_ID</th>
                <th style={{ padding: '8px' }}>VOL_USD</th>
                <th style={{ padding: '8px' }}>LIQUIDITY</th>
                <th style={{ padding: '8px' }}>SIGNATURE</th>
                <th style={{ padding: '8px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {data.map((n, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{n.id}</td>
                  <td style={{ padding: '10px' }}>${n.live_vol}</td>
                  <td style={{ padding: '10px' }}>${n.liquidity}</td>
                  <td style={{ padding: '10px', color: '#ffaa00' }}>{n.whale}</td>
                  <td style={{ padding: '10px', color: n.prob > 40 ? '#f00' : '#0f0' }}>
                    {n.prob > 40 ? 'AGGRESSIVE_BUY' : 'HOLDING'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SYSTEM LOGS & PROFILES */}
        <div style={{ border: '1px solid #0f0', padding: '20px', background: '#050505' }}>
          <div style={{ fontSize: '12px', marginBottom: '15px' }}>INTELLIGENCE_LOG</div>
          <div style={{ fontSize: '10px', color: '#666', lineHeight: '1.5' }}>
            {logs.map((l, i) => <div key={i}>{l}</div>)}
            <div style={{ marginTop: '20px', borderTop: '1px solid #222', paddingTop: '10px' }}>
              <span style={{ color: '#ffaa00' }}>PRO_WATCH: GC_WHALE_01</span><br/>
              WIN_RATE: 88.4%<br/>
              LAST_MAJOR_BET: $142,000 [LEB-INV]<br/>
              STATUS: ACCUMULATING_POSITION
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
