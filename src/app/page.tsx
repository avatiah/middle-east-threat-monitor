'use client';
import React, { useEffect, useState } from 'react';

export default function AdminThreatEngine() {
  const [data, setData] = useState<any[]>([]);

  const sync = async () => {
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (e) { console.error("SYNC_INTERRUPTED"); }
  };

  useEffect(() => { sync(); const i = setInterval(sync, 5000); return () => clearInterval(i); }, []);

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '25px', fontFamily: 'monospace' }}>
      
      {/* ПАНЕЛЬ АГРЕГАЦИИ */}
      <div style={{ border: '1px solid #0f0', padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>THREAT_ENGINE_V24.0 // INFINITY_MONITOR</div>
          <div style={{ fontSize: '10px', opacity: 0.6 }}>CONNECTED: POLYMARKET_GAMMA_NODE // MODE: DIRECT_DATA_EXTRACTION</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '32px', color: '#f00' }}>{data.length ? Math.max(...data.map(d=>d.prob)) : 0}%</div>
          <div style={{ fontSize: '9px' }}>MAX_THREAT_LEVEL</div>
        </div>
      </div>

      {/* ОСНОВНЫЕ СЕНСОРЫ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        {data.map((n, i) => (
          <div key={i} style={{ border: '1px solid #333', padding: '15px', background: '#050505' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
              <span>[{n.id}] {n.status}</span>
              <span style={{ color: n.prob > 40 ? '#f00' : '#0f0' }}>DEFCON {n.prob > 40 ? '2' : '4'}</span>
            </div>
            <div style={{ fontSize: '58px', fontWeight: 'bold', color: n.prob > 40 ? '#f00' : '#0f0' }}>{n.prob}%</div>
            <div style={{ fontSize: '9px', color: '#fff', opacity: 0.7, height: '30px' }}>{n.title}</div>
            <div style={{ height: '2px', background: '#111', marginTop: '10px' }}>
              <div style={{ height: '100%', width: `${n.prob}%`, background: n.prob > 40 ? '#f00' : '#0f0' }} />
            </div>
          </div>
        ))}
      </div>

      {/* ТАБЛИЦА МАКСИМАЛЬНЫХ ДАННЫХ */}
      <div style={{ border: '1px solid #0f0', padding: '20px' }}>
        <div style={{ fontSize: '12px', marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
          DEEP_DATA_ANALYTICS // КТО И СКОЛЬКО СТАВИТ НА КОНФЛИКТ
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
          <thead>
            <tr style={{ opacity: 0.4 }}>
              <th style={{ padding: '10px' }}>УЗЕЛ_ID</th>
              <th style={{ padding: '10px' }}>ОБЪЕМ (USD)</th>
              <th style={{ padding: '10px' }}>ЛИКВИДНОСТЬ</th>
              <th style={{ padding: '10px' }}>КРУПНЫЙ ИГРОК</th>
              <th style={{ padding: '10px' }}>ИНТЕРПРЕТАЦИЯ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((n, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{n.id}</td>
                <td style={{ padding: '12px' }}>${n.volume}</td>
                <td style={{ padding: '12px' }}>${n.liquidity}</td>
                <td style={{ padding: '12px', color: '#ffaa00' }}>{n.signature}</td>
                <td style={{ padding: '12px', color: n.prob > 40 ? '#f00' : '#888' }}>
                  {n.prob > 45 ? 'КРИТИЧЕСКАЯ_УГРОЗА' : 'РЕГИОНАЛЬНОЕ_ТРЕНИЕ'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
