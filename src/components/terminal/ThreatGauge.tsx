'use client';

export const ThreatGauge = ({ value }: { value: number }) => {
  const needleRotation = (value / 10) * 180 - 90;

  return (
    <section style={{ border: '2px solid #ff003c', background: '#100', padding: '20px', marginBottom: '30px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '30px' }}>
      <div style={{ width: '200px', height: '120px', position: 'relative' }}>
        <svg viewBox="0 0 100 60" style={{ width: '100%' }}>
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#333" strokeWidth="10" />
          <path d="M 10 50 A 40 40 0 0 1 34 18" fill="none" stroke="#00ff41" strokeWidth="10" />
          <path d="M 34 18 A 40 40 0 0 1 66 18" fill="none" stroke="#ffaa00" strokeWidth="10" />
          <path d="M 66 18 A 40 40 0 0 1 90 50" fill="none" stroke="#ff003c" strokeWidth="10" />
          <line x1="50" y1="50" x2="50" y2="15" stroke="#fff" strokeWidth="2" transform={`rotate(${needleRotation}, 50, 50)`} style={{ transition: 'transform 1s ease-in-out' }} />
          <circle cx="50" cy="50" r="3" fill="#fff" />
        </svg>
        <div style={{ textAlign: 'center', marginTop: '-10px', fontSize: '24px', fontWeight: '900', color: '#ff003c' }}>
          {value}<span style={{fontSize: '12px'}}>/10</span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <div style={{ fontSize: '10px', color: '#ff003c', marginBottom: '10px' }}>AGGREGATED THREAT INDEX (BETA)</div>
        <div style={{ fontSize: '11px', lineHeight: '1.4', color: '#888' }}>
          <strong style={{ color: '#fff' }}>WARNING:</strong> This index is a mathematical average of market expectations. 
          <br />
          <span style={{ color: '#ff003c' }}>REASON:</span> Reflects trader speculation, not classified military directives.
        </div>
      </div>
    </section>
  );
};
