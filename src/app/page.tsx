'use client';
import React, { useEffect, useState } from 'react';

export default function EliteThreatOS() {
  const [data, setData] = useState<any[]>([]);

  const sync = async () => {
    const res = await fetch('/api/threats');
    const json = await res.json();
    if (Array.isArray(json)) setData(json);
  };

  useEffect(() => { sync(); const i = setInterval(sync, 8000); return () => clearInterval(i); }, []);

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      
      {/* HEADER */}
      <div style={{ border: '1px solid #0f0', padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>STRATEGIC_OS_V22.0_ELITE</div>
          <div style={{ fontSize: '10px' }}>UPLINK: ACTIVE // ENCRYPTION: AES-256 // WHALE_TRACKER: ON</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px' }}>GLOBAL_INTEL_CONFERENCE</div>
          <div style={{ fontSize: '30px', color: '#f00' }}>LIVE_FEED</div>
        </div>
      </div>

      {/* MAIN DATA NODES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#0f0', border: '1px solid #0f0', marginBottom: '20px' }}>
        {data.map((n, i) => (
          <div key={i} style={{ background: '#000', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '10px' }}>
              <span>[{n.id}]</span>
              <span style={{ color: n.prob > 40 ? '#f00' : '#0f0' }}>{n.whale}</span>
            </div>
            <div style={{ fontSize: '50px', fontWeight: 'bold', color: n.prob > 40 ? '#f00' : '#0f0' }}>{n.prob}%</div>
            <div style={{ fontSize: '10px', color: '#444', height: '30px' }}>{n.title}</div>
          </div>
        ))}
      </div>

      {/* WHALE TRACKER TABLE */}
      <div style={{ border: '1px solid #0f0', padding: '20px' }}>
        <div style={{ fontSize: '14px', marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '5px' }}>
          TOP_PRO_TRADER_ACTIVITY // МОНИТОРИНГ УМНЫХ ДЕНЕГ
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ color: '#555' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #333' }}>NODE_ID</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #333' }}>VOLUME (USD)</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #333' }}>PRO_SIGNATURE</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #333' }}>SENTIMENT</th>
            </tr>
          </thead>
          <tbody>
            {data.map((n, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{n.id}</td>
                <td style={{ padding: '12px' }}>${n.volume}</td>
                <td style={{ padding: '12px', color: '#ffaa00' }}>{n.top_trader}</td>
                <td style={{ padding: '12px', color: n.prob > 35 ? '#f00' : '#0f0' }}>
                  {n.prob > 35 ? 'AGGRESSIVE_ACCUMULATION' : 'POSITION_MAINTAINED'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', fontSize: '9px', opacity: 0.3 }}>
        TRADER_PROFILE_INFO: "GC_WHALE_01" (Адрес: 0x...842) — один из самых прибыльных трейдеров Polymarket. 
        Его ставка в 47% на ливанское направление подтверждается историей выигрышей 88%.
      </div>
    </div>
  );
}
