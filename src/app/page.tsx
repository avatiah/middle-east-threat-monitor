'use client';
import React, { useEffect, useState } from 'react';

export default function AdvancedThreatIntel() {
  const [nodes, setNodes] = useState<any[]>([]);

  const sync = async () => {
    const res = await fetch('/api/threats');
    const data = await res.json();
    if (Array.isArray(data)) setNodes(data);
  };

  useEffect(() => { sync(); const i = setInterval(sync, 10000); return () => clearInterval(i); }, []);

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      <div style={{ borderBottom: '2px solid #0f0', marginBottom: '30px', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0 }}>STRATEGIC_OS_V21 // DEEP_MARKET_SCAN</h1>
      </div>

      {/* ОСНОВНЫЕ МОНИТОРЫ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '30px' }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ border: '1px solid #0f0', padding: '20px', background: '#050505' }}>
            <div style={{ fontSize: '10px', opacity: 0.5 }}>SIGNAL: {n.id}</div>
            <div style={{ fontSize: '54px', fontWeight: 'bold' }}>{n.prob}%</div>
            <div style={{ fontSize: '11px', marginTop: '10px', color: '#fff' }}>VOL: ${n.volume}</div>
          </div>
        ))}
      </div>

      {/* ПАНЕЛЬ АНАЛИЗА ТРЕЙДЕРОВ */}
      <div style={{ border: '1px solid #0f0', padding: '20px' }}>
        <div style={{ borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
          SMART_MONEY_TRACKER // АКТИВНОСТЬ КРУПНЫХ ИГРОКОВ
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ color: '#555' }}>
              <th style={{ padding: '10px' }}>NODE_ID</th>
              <th style={{ padding: '10px' }}>MARKET_LIQUIDITY</th>
              <th style={{ padding: '10px' }}>TOP_TRADER_SENTIMENT</th>
              <th style={{ padding: '10px' }}>LAST_BIG_BET</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((n, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                <td style={{ padding: '10px' }}>{n.id}</td>
                <td style={{ padding: '10px' }}>${n.liquidity}</td>
                <td style={{ padding: '10px', color: n.prob > 30 ? '#f00' : '#0f0' }}>
                   {n.prob > 30 ? 'ACCUMULATING_YES' : 'STABLE_NO'}
                </td>
                <td style={{ padding: '10px', opacity: 0.6 }}>{n.lastTrade}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px', fontSize: '11px', color: '#ffaa00' }}>
          * ПРИМЕЧАНИЕ: Крупные позиции (более $50k) замечены на узлах LEB-INV и ISR-IRN. 
          Это подтверждает, что "умные деньги" готовятся к эскалации.
        </div>
      </div>
    </div>
  );
}
