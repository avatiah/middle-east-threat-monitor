'use client';

import React, { useState } from 'react';

export default function ThreatTerminalWithGauge() {
  const [lang, setLang] = useState<'RU' | 'EN'>('RU');
  const threatIndex = 6.5; // Текущий расчетный индекс

  const DATA = {
    energy: [
      { name: "Oil (Brent)", price: 71.49, change: -0.63, time: "04:46 AM" },
      { name: "Oil (WTI)", price: 66.05, change: -0.57, time: "04:55 AM" },
      { name: "Coal (API2)", price: 116.70, change: 1.25, time: "LIVE" },
      { name: "Natural Gas", price: 2.98, change: -0.43, time: "04:55 AM" }
    ],
    threats: [
      { 
        id: "ISR-IRN", title: "УДАР ИЗРАИЛЯ ПО ИРАНУ", feb: 27, mar: 59,
        traders: [
          { name: "RicoSauve666", win: "95%", pnl: "~$154,219", note: "Status: Under Investigation" },
          { name: "0x34..f1 (Fredi)", win: "79%", pnl: "Verified Holder" }
        ]
      },
      { 
        id: "USA-STRIKE", title: "ИНТЕРВЕНЦИЯ США", feb: 28, mar: 62,
        traders: [
          { name: "Rundeep", win: "76.4%", pnl: "Professional" },
          { name: "Domer", win: "81%", pnl: "Political Expert" }
        ]
      }
    ],
    osint: [
      { src: "SIGNAL_CONTEXT", text: "Мониторинг перемещения KC-707 и CVN-72. Данные требуют подтверждения." },
      { src: "POL_CONTEXT", text: "Рынок реагирует на волатильность USA-STRIKE." }
    ]
  };

  // Расчет поворота стрелки (от -90 до 90 градусов для полукруга)
  const needleRotation = (threatIndex / 10) * 180 - 90;

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px', color: '#00ff41', fontFamily: 'monospace' }}>
      
      {/* GRAPHIC GAUGE SECTION */}
      <section style={{ border: '2px solid #ff003c', background: '#100', padding: '20px', marginBottom: '30px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '30px' }}>
        
        {/* SVG SPEEDOMETER */}
        <div style={{ width: '200px', height: '120px', position: 'relative' }}>
          <svg viewBox="0 0 100 60" style={{ width: '100%' }}>
            {/* Трёхцветная дуга */}
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#333" strokeWidth="10" />
            <path d="M 10 50 A 40 40 0 0 1 34 18" fill="none" stroke="#00ff41" strokeWidth="10" /> {/* Green (Safe) */}
            <path d="M 34 18 A 40 40 0 0 1 66 18" fill="none" stroke="#ffaa00" strokeWidth="10" /> {/* Yellow (Caution) */}
            <path d="M 66 18 A 40 40 0 0 1 90 50" fill="none" stroke="#ff003c" strokeWidth="10" /> {/* Red (Danger) */}
            
            {/* Стрелка (Needle) */}
            <line x1="50" y1="50" x2="50" y2="15" stroke="#fff" strokeWidth="2" 
                  transform={`rotate(${needleRotation}, 50, 50)`} style={{ transition: 'transform 1s ease-in-out' }} />
            <circle cx="50" cy="50" r="3" fill="#fff" />
          </svg>
          <div style={{ textAlign: 'center', marginTop: '-10px', fontSize: '24px', fontWeight: '900', color: '#ff003c' }}>
            {threatIndex}<span style={{fontSize: '12px'}}>/10</span>
          </div>
        </div>

        {/* ПРЕДУПРЕЖДЕНИЕ */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ fontSize: '10px', color: '#ff003c', marginBottom: '10px' }}>AGGREGATED THREAT INDEX (BETA)</div>
          <div style={{ fontSize: '11px', lineHeight: '1.4', color: '#888' }}>
            <strong style={{ color: '#fff' }}>ВНИМАНИЕ:</strong> Этот индекс — математическое усреднение ожиданий рынка (Polymarket) и цен на энергию. 
            Его <strong style={{color: '#fff'}}>нельзя</strong> использовать как единственный источник для принятия решений. 
            <br /><br />
            <span style={{ color: '#ff003c' }}>ПОЧЕМУ:</span> Рынок отражает страхи и спекуляции трейдеров (например, RicoSauve666), а не секретные военные директивы. 
            Разрыв между реальной угрозой и индексом может составлять до 48 часов.
          </div>
        </div>
      </section>

      {/* ENERGY PANEL (BUSINESS INSIDER) */}
      <section style={{ border: '1px solid #333', marginBottom: '30px', background: '#050505' }}>
        <div style={{ background: '#fff', color: '#000', padding: '10px 20px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
          <span>ENERGY BUSINESS INSIDER</span>
          <button onClick={() => setLang(lang==='RU'?'EN':'RU')} style={{cursor:'pointer', fontWeight:'bold'}}>{lang}</button>
        </div>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
          <tbody>
            {DATA.energy.map(e => (
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

      {/* THREAT MODULES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {DATA.threats.map(m => (
          <div key={m.id} style={{ border: '1px solid #222', background: '#080808', padding: '20px' }}>
            <h2 style={{ color: '#fff', fontSize: '14px', marginBottom: '15px', borderLeft: '3px solid #00ff41', paddingLeft: '10px' }}>{m.title}</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1, border: '1px solid #1a1a1a', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#3b82f6', fontWeight: 'bold' }}>{m.feb}%</div>
                <div style={{ fontSize: '9px', color: '#666' }}>FEBRUARY</div>
              </div>
              <div style={{ flex: 1, border: '1px solid #1a1a1a', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#ff003c', fontWeight: 'bold' }}>{m.mar}%</div>
                <div style={{ fontSize: '9px', color: '#666' }}>MARCH</div>
              </div>
            </div>
            {m.traders.map(t => (
              <div key={t.name} style={{ fontSize: '11px', color: '#fff', marginBottom: '4px' }}>
                {t.name} | Acc: <span style={{color: '#00ff41'}}>{t.win}</span> | PNL: <span style={{color: '#3b82f6'}}>{t.pnl}</span>
                {t.note && <div style={{color: '#ff003c', fontSize: '9px'}}>{t.note}</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
