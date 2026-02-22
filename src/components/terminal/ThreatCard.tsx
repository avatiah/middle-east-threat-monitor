'use client';

export const ThreatCard = ({ m }: { m: any }) => (
  <div style={{ border: '1px solid #222', background: '#080808', padding: '20px' }}>
    <h2 style={{ color: '#fff', fontSize: '14px', marginBottom: '15px', borderLeft: '3px solid #00ff41', paddingLeft: '10px' }}>{m.title}</h2>
    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
      <div style={{ flex: 1, border: '1px solid #1a1a1a', padding: '10px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', color: '#3b82f6', fontWeight: 'bold' }}>{m.feb}%</div>
        <div style={{ fontSize: '9px', color: '#666' }}>BY FEB 28</div>
      </div>
      <div style={{ flex: 1, border: '1px solid #1a1a1a', padding: '10px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', color: '#ff003c', fontWeight: 'bold' }}>{m.mar}%</div>
        <div style={{ fontSize: '9px', color: '#666' }}>BY MAR 31</div>
      </div>
    </div>
    {m.traders.map((t: any) => (
      <div key={t.name} style={{ fontSize: '11px', color: '#fff', marginBottom: '4px' }}>
        {t.name} | Acc: <span style={{color: '#00ff41'}}>{t.win}</span> | PNL: <span style={{color: '#3b82f6'}}>{t.pnl}</span>
        {t.note && <div style={{color: '#ff003c', fontSize: '9px'}}>{t.note}</div>}
      </div>
    ))}
  </div>
);
