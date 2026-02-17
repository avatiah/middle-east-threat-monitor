'use client';
import React, { useEffect, useState, useRef } from 'react';

export default function IntelligenceOS() {
  const [data, setData] = useState<any[]>([]);
  const lastData = useRef<any[]>([]); // Храним данные для защиты от сбоев

  const sync = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      
      // Логика сохранения данных: если пришел null, берем из памяти
      const stableData = json.map((node: any, i: number) => {
        if (node.prob === null && lastData.current[i]) {
          return { ...lastData.current[i], status: 'STALE' };
        }
        return node;
      });

      setData(stableData);
      lastData.current = stableData;
    } catch (e) { console.warn("SYNC_LOCKED"); }
  };

  useEffect(() => { sync(); const i = setInterval(sync, 10000); return () => clearInterval(i); }, []);

  const getDefcon = (p: number) => {
    if (p > 40) return { label: 'DEFCON 2', color: '#ff0000' };
    if (p > 25) return { label: 'DEFCON 3', color: '#ffaa00' };
    return { label: 'DEFCON 4', color: '#0f0' };
  };

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #0f0', paddingBottom: '20px', marginBottom: '40px' }}>
        <div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>STRATEGIC_INTELLIGENCE_OS</div>
          <div style={{ fontSize: '10px', opacity: 0.5 }}>DATA_SOURCE: POLYMARKET_LIVE_NODES // ADAPTIVE_MONITORING_ACTIVE</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px' }}>SYSTEM_STATUS</div>
          <div style={{ color: '#0f0' }}>● SIGNAL_STABLE</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px', background: '#0f0', border: '1px solid #0f0' }}>
        {data.map((n, i) => {
          const state = getDefcon(n.prob || 0);
          return (
            <div key={i} style={{ background: '#000', padding: '30px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: n.status === 'STALE' ? '#555' : '#0f0' }}>
                  [{n.id}] {n.status === 'STALE' ? ' (CACHED)' : ''}
                </div>
                <div style={{ background: state.color, color: '#000', fontSize: '10px', padding: '2px 6px', fontWeight: 'bold' }}>
                  {state.label}
                </div>
              </div>

              <div style={{ fontSize: '64px', fontWeight: 'bold', margin: '20px 0', color: state.color }}>
                {n.prob !== null ? `${n.prob}%` : '---'}
              </div>

              <div style={{ fontSize: '14px', color: '#fff', marginBottom: '10px' }}>{n.desc}</div>
              <div style={{ fontSize: '9px', color: '#444', height: '30px', overflow: 'hidden' }}>{n.title}</div>

              <div style={{ height: '4px', background: '#111', marginTop: '20px' }}>
                <div style={{ height: '100%', width: `${n.prob}%`, background: state.color, boxShadow: `0 0 15px ${state.color}` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '40px', fontSize: '10px', color: '#222' }}>
        LOG: {new Date().toISOString()} // THREAT_LEVEL_CALCULATED_BY_MARKET_SENTIMENT
      </div>
    </div>
  );
}
