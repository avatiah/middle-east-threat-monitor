'use client';

export const EnergyTable = ({ data }: { data: any[] }) => (
  <section style={{ border: '1px solid #333', marginBottom: '30px', background: '#050505' }}>
    <div style={{ background: '#fff', color: '#000', padding: '10px 20px', fontWeight: 'bold' }}>
      BUSINESS INSIDER // ENERGY MARKETS
    </div>
    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
      <thead>
        <tr style={{ color: '#666', borderBottom: '1px solid #222' }}>
          <th style={{ padding: '12px' }}>TICKER</th>
          <th style={{ padding: '12px' }}>PRICE</th>
          <th style={{ padding: '12px' }}>CHANGE</th>
          <th style={{ padding: '12px' }}>UPDATE</th>
        </tr>
      </thead>
      <tbody>
        {data.map(e => (
          <tr key={e.name} style={{ borderBottom: '1px solid #111', color: '#fff' }}>
            <td style={{ padding: '12px' }}>{e.name}</td>
            <td style={{ padding: '12px' }}>{e.price}</td>
            <td style={{ padding: '12px', color: e.change < 0 ? '#ff003c' : '#00ff41' }}>{e.change}%</td>
            <td style={{ padding: '12px', color: '#444' }}>{e.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);
