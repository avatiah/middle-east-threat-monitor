'use client';
import React, { useEffect, useState, useRef } from 'react';

export default function StrategicOSV23() {
  const [data, setData] = useState<any[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        // Добавляем запись в лог при изменении цен
        const timestamp = new Date().toLocaleTimeString();
        setLog(prev => [`[${timestamp}] SIGNAL_STABLE: UPDATING_NODES...`, ...prev.slice(0, 5)]);
      }
    } catch (e) { console.error("SIGNAL_LOST"); }
  };

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 8000); return () => clearInterval(i); }, []);

  const getDefcon = (p: number) => {
    if (p > 40) return { label: 'DEFCON 2', color: '#ff0000', msg: 'МГНОВЕННАЯ ГОТОВНОСТЬ' };
    if (p > 25) return { label: 'DEFCON 3', color: '#ffaa00', msg: 'ПОВЫШЕННЫЙ РИСК' };
    return { label: 'DEFCON 4', color: '#0f0', msg: 'СТАНДАРТНЫЙ МОНИТОРИНГ' };
  };

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace', textTransform: 'uppercase' }}>
      
      {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
      <div style={{ border: '1px solid #0f0', padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '2px' }}>STRATEGIC_INTELLIGENCE_OS // V23.0</div>
          <div style={{ fontSize: '10px', opacity: 0.6 }}>SYSTEM_IDENT: 11.0-ENTERPRISE // MODE: MAXIMUM_INTEL</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{data.length ? Math.round(data.reduce((a,b)=>a+b.prob,0)/data.length) : 0}%</div>
          <div style={{ fontSize: '10px' }}>AVG_THEAT_INDEX</div>
        </div>
      </div>

      {/* ГРИД МОНИТОРОВ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        {data.map((n, i) => {
          const state = getDefcon(n.prob);
          return (
            <div key={i} style={{ border: '1px solid #0f0', padding: '20px', background: '#050505', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '10px' }}>
                <span style={{ color: n.status === 'LIVE' ? '#0f0' : '#555' }}>[{n.status}] {n.id}</span>
                <span style={{ background: state.color, color: '#000', padding: '0 4px' }}>{state.label}</span>
              </div>
              <div style={{ fontSize: '56px', fontWeight: 'bold', color: state.color, margin: '10px 0' }}>{n.prob}%</div>
              <div style={{ fontSize: '10px', height: '35px', overflow: 'hidden', color: '#fff', opacity: 0.8 }}>{n.title}</div>
              <div style={{ marginTop: '15px', height: '3px', background: '#111' }}>
                <div style={{ height: '100%', width: `${n.prob}%`, background: state.color, boxShadow: `0 0 10px ${state.color}` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* БЛОК АНАЛИТИКИ КИТОВ И ИНТЕРПРЕТАЦИИ */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <div style={{ fontSize: '14px', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>WHALE_WATCH // ТРЕЙДЕРЫ-ЛИДЕРЫ (WIN_RATE 85%+)</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr style={{ textAlign: 'left', opacity: 0.5 }}>
                <th style={{ padding: '8px' }}>NODE</th>
                <th style={{ padding: '8px' }}>LIQUIDITY</th>
                <th style={{ padding: '8px' }}>PRO_SIGNATURE</th>
                <th style={{ padding: '8px' }}>WHALE_ALERT</th>
              </tr>
            </thead>
            <tbody>
              {data.map((n, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{n.id}</td>
                  <td style={{ padding: '10px' }}>${n.liquidity}</td>
                  <td style={{ padding: '10px', color: '#ffaa00' }}>{n.prob > 40 ? 'GC_WHALE_01' : 'MULTIPLE_RETAIL'}</td>
                  <td style={{ padding: '10px', color: n.prob > 40 ? '#f00' : '#0f0' }}>{n.whale_alert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ border: '1px solid #0f0', padding: '20px', background: '#050505' }}>
          <div style={{ fontSize: '14px', marginBottom: '15px' }}>SYSTEM_LOG</div>
          <div style={{ fontSize: '10px', color: '#555', lineHeight: '1.6' }}>
            {log.map((l, i) => <div key={i}>{l}</div>)}
            <div style={{ marginTop: '20px', color: '#888' }}>
              INFO: GC_WHALE_01 (WIN_RATE: 88%) <br/>
              ПОЗИЦИЯ: LONG [LEB-INV] <br/>
              ПОСЛЕДНЯЯ АКТИВНОСТЬ: 17.02.2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
