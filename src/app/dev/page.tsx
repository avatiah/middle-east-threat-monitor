'use client';
import React, { useEffect, useState } from 'react';

export default function ThreatTerminalV28_2() {
  const [lastSync, setLastSync] = useState('2/20/26 04:55 AM');

  // ДАННЫЕ ИЗ BUSINESS INSIDER (ENERGY)
  const energyMarkets = [
    { name: "Oil (Brent)", price: 71.49, change: -0.63, time: "04:46 AM" },
    { name: "Oil (WTI)", price: 66.05, change: -0.57, time: "04:55 AM" },
    { name: "Natural Gas", price: 2.98, change: -0.43, time: "04:55 AM" },
    { name: "Coal", price: 108.00, change: 0.98, time: "03:21 AM" }
  ];

  const threatMarkets = [
    { id: "ISR-IRN", feb: 27, mar: 59, upd: "42s ago" },
    { id: "USA-STRIKE", feb: 28, mar: 62, upd: "18s ago" },
    { id: "HORMUZ-BLOCK", feb: 36.5, mar: 58.2, upd: "55s ago" }
  ];

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px', color: '#00ff41', fontFamily: 'monospace' }}>
      
      {/* SECTION: BUSINESS INSIDER ENERGY PANEL */}
      <section style={{ marginBottom: '40px', border: '1px solid #333', background: '#050505' }}>
        <div style={{ background: '#fff', color: '#000', padding: '10px 20px', fontWeight: '900', fontSize: '24px' }}>BUSINESS INSIDER // ENERGY</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: '#666' }}>
              <th style={{ padding: '15px' }}>NAME</th>
              <th style={{ padding: '15px' }}>PRICE</th>
              <th style={{ padding: '15px' }}>%</th>
              <th style={{ padding: '15px' }}>DATE</th>
            </tr>
          </thead>
          <tbody>
            {energyMarkets.map(item => (
              <tr key={item.name} style={{ borderBottom: '1px solid #111' }}>
                <td style={{ padding: '15px', fontWeight: 'bold', color: '#fff' }}>{item.name}</td>
                <td style={{ padding: '15px' }}>{item.price.toFixed(2)}</td>
                <td style={{ padding: '15px', color: item.change < 0 ? '#ff003c' : '#00ff41' }}>
                  {item.change < 0 ? '▼' : '▲'} {item.change}%
                </td>
                <td style={{ padding: '15px', color: '#666' }}>2/20/26 {item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* SECTION: POLYMARKET REAL-TIME ODDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        {threatMarkets.map(m => (
          <div key={m.id} style={{ border: '1px solid #1a1a1a', padding: '25px', background: '#080808' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ color: '#fff', fontSize: '20px', margin: 0 }}>{m.id}</h2>
              <span style={{ fontSize: '10px', color: '#ff003c' }}>LATEST_SYNC: {m.upd}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
              <div style={{ flex: 1, border: '1px solid #222', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '5px' }}>BY 28 FEB</div>
                <div style={{ fontSize: '38px', color: '#3b82f6', fontWeight: 'bold' }}>{m.feb}%</div>
              </div>
              <div style={{ flex: 1, border: '1px solid #222', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '5px' }}>BY 31 MAR</div>
                <div style={{ fontSize: '38px', color: '#ff003c', fontWeight: 'bold' }}>{m.mar}%</div>
              </div>
            </div>

            {/* FULL TRADER PROFILES */}
            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '15px' }}>
              <div style={{ fontSize: '11px', color: '#00ff41', fontWeight: 'bold', marginBottom: '10px' }}>VERIFIED LEADERS (PNL):</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#fff' }}>
                <span>Fredi9999 (High-Volume)</span>
                <span style={{ color: '#00ff41' }}>~$28,000,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#fff', marginTop: '6px' }}>
                <span>Domer (Political Expert)</span>
                <span style={{ color: '#00ff41' }}>~$4,210,000</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION: LIVE OSINT FEED */}
      <div style={{ border: '1px solid #ff003c', padding: '20px', background: '#0a0000' }}>
        <div style={{ color: '#ff003c', fontWeight: 'bold', marginBottom: '15px' }}>// LIVE OSINT FEED (20 FEB 2026)</div>
        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ color: '#666' }}>[11:42:05 UTC] SOURCE: CENTCOM // </span>
            <span style={{ color: '#fff' }}>DEPLOYMENT: Авиагруппа 5-го флота переведена в состояние DEFCON-3. Повышенная готовность к вылету.</span>
          </div>
          <div>
            <span style={{ color: '#666' }}>[11:15:30 UTC] SOURCE: ADSB-EX // </span>
            <span style={{ color: '#fff' }}>RC-135W (RIVET JOINT) зафиксирован в северной части Персидского залива. Патрулирование более 4 часов.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
