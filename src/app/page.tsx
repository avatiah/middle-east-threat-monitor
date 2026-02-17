'use client';
import React, { useEffect, useState, useRef } from 'react';

export default function IntelligenceOS() {
  const [data, setData] = useState<any[]>([]);
  const lastData = useRef<any[]>([]);

  const sync = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
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
    if (p > 40) return { label: 'DEFCON 2', color: '#ff0000', context: 'КРИТИЧЕСКАЯ УГРОЗА: Немедленная готовность' };
    if (p > 25) return { label: 'DEFCON 3', color: '#ffaa00', context: 'ВЫСОКИЙ РИСК: Повышенная боеготовность' };
    return { label: 'DEFCON 4', color: '#0f0', context: 'УМЕРЕННЫЙ РИСК: Стандартный мониторинг' };
  };

  const avgRisk = data.length ? Math.round(data.reduce((a, b) => a + (b.prob || 0), 0) / data.length) : 0;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #0f0', padding: '20px', marginBottom: '30px' }}>
        <div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>STRATEGIC_INTELLIGENCE_OS</div>
          <div style={{ fontSize: '10px', opacity: 0.6 }}>CORE_V20_SYNTHETIC // SOURCE: POLYMARKET_NODES</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px' }}>AGGREGATED_RISK</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: avgRisk > 30 ? '#f00' : '#0f0' }}>{avgRisk}%</div>
        </div>
      </div>

      {/* MONITORING GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        {data.map((n, i) => {
          const state = getDefcon(n.prob || 0);
          return (
            <div key={i} style={{ border: '1px solid #333', padding: '20px', background: '#050505' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>[{n.id}]</span>
                <span style={{ fontSize: '10px', background: state.color, color: '#000', padding: '1px 5px' }}>{state.label}</span>
              </div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: state.color, margin: '15px 0' }}>
                {n.prob !== null ? `${n.prob}%` : '---'}
              </div>
              <div style={{ height: '2px', background: '#222' }}>
                <div style={{ height: '100%', width: `${n.prob}%`, background: state.color, boxShadow: `0 0 10px ${state.color}` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* DECODING TABLE (НОВЫЙ БЛОК) */}
      <div style={{ border: '1px solid #0f0', padding: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
          SIGNAL_DECODING_REPORT // РАСШИФРОВКА ТЕКУЩИХ ДАННЫХ
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ textAlign: 'left', opacity: 0.6 }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #333' }}>ID</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #333' }}>ИНТЕРПРЕТАЦИЯ</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #333' }}>ВОЕННЫЙ КОНТЕКСТ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((n, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                <td style={{ padding: '12px', fontWeight: 'bold', color: getDefcon(n.prob || 0).color }}>{n.id}</td>
                <td style={{ padding: '12px' }}>{getDefcon(n.prob || 0).context}</td>
                <td style={{ padding: '12px', color: '#ccc' }}>
                  {n.id === 'LEB-INV' && 'Вероятность начала масштабной наземной операции. Порог 45%+ критичен.'}
                  {n.id === 'ISR-IRN' && 'Прямая эскалация между государствами. Текущий уровень требует внимания.'}
                  {n.id === 'HORMUZ' && 'Риск блокировки транспортных артерий. Прямое влияние на нефть.'}
                  {n.id === 'USA-LOG' && 'Степень прямого участия ВС США в кинетических действиях.'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', fontSize: '10px', opacity: 0.3 }}>
        LOG: {new Date().toISOString()} // ALL_SIGNALS_DECODED_STABLE
      </div>
    </div>
  );
}
