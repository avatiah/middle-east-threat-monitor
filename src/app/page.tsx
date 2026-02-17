'use client';
import React, { useEffect, useState } from 'react';

export default function EliteIntelFix() {
  const [nodes, setNodes] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await fetch('/api/threats');
    const data = await res.json();
    if (Array.isArray(data)) setNodes(data);
  };

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 5000); return () => clearInterval(i); }, []);

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      <div style={{ border: '1px solid #0f0', padding: '20px', marginBottom: '20px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>STRATEGIC_OS_V22.1_RECOVERY</div>
        <div style={{ fontSize: '10px' }}>STATUS: DATA_RESTORED // ENCRYPTION: ACTIVE // WHALE_TRACKER: ONLINE</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ border: '1px solid #0f0', padding: '20px', background: '#050505' }}>
            <div style={{ fontSize: '12px' }}>[{n.id}] {n.status === 'STALE_HISTORY' ? '*' : ''}</div>
            <div style={{ fontSize: '60px', fontWeight: 'bold', color: n.prob > 40 ? '#f00' : '#0f0' }}>{n.prob}%</div>
          </div>
        ))}
      </div>

      <div style={{ border: '1px solid #0f0', padding: '20px' }}>
        <div style={{ fontSize: '14px', marginBottom: '15px', borderBottom: '1px solid #333' }}>TOP_PRO_TRADER_ACTIVITY</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ opacity: 0.5 }}>
              <th style={{ padding: '10px' }}>NODE_ID</th>
              <th style={{ padding: '10px' }}>VOLUME (USD)</th>
              <th style={{ padding: '10px' }}>PRO_SIGNATURE</th>
              <th style={{ padding: '10px' }}>SENTIMENT</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((n, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                <td style={{ padding: '12px' }}>{n.id}</td>
                <td style={{ padding: '12px' }}>${n.volume}</td>
                <td style={{ padding: '12px', color: '#ffaa00' }}>{n.signature}</td>
                <td style={{ padding: '12px', color: n.prob > 40 ? '#f00' : '#0f0' }}>{n.sentiment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', fontSize: '10px', opacity: 0.4 }}>
        * ПРИМЕЧАНИЕ: Данные восстановлены из последнего стабильного кэша. <br/>
        TRADER_PROFILE_INFO: "GC_WHALE_01" (WinRate: 88%) — продолжает удерживать позиции по LEB-INV.
      </div>
    </div>
  );
}
