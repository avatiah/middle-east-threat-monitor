'use client';

import React, { useState } from 'react';

export default function ThreatTerminalEnStrict() {
  // По умолчанию английский язык
  const [lang, setLang] = useState<'EN' | 'RU'>('EN');
  const threatIndex = 6.5;

  const DATA = {
    energy: [
      { name: "Oil (Brent)", price: 71.49, change: -0.63, time: "04:46 AM" },
      { name: "Oil (WTI)", price: 66.05, change: -0.57, time: "04:55 AM" },
      { name: "Coal (API2)", price: 116.70, change: 1.25, time: "LIVE" },
      { name: "Natural Gas", price: 2.98, change: -0.43, time: "04:55 AM" }
    ],
    threats: [
      { 
        id: "ISR-IRN", 
        title: lang === 'EN' ? "ISRAEL STRIKE ON IRAN" : "УДАР ИЗРАИЛЯ ПО ИРАНУ", 
        feb: 27, mar: 59,
        traders: [
          { name: "RicoSauve666", win: "95%", pnl: "~$154,219", note: "Status: Under Investigation" },
          { name: "0x34..f1 (Fredi)", win: "79%", pnl: "Verified Holder" }
        ]
      },
      { 
        id: "USA-STRIKE", 
        title: lang === 'EN' ? "USA MILITARY INTERVENTION" : "ИНТЕРВЕНЦИЯ США", 
        feb: 28, mar: 62,
        traders: [
          { name: "Rundeep", win: "76.4%", pnl: "Professional" },
          { name: "Domer", win: "81%", pnl: "Political Expert" }
        ]
      },
      { 
        id: "HORMUZ-BLOCK", 
        title: lang === 'EN' ? "HORMUZ STRAIT BLOCKADE" : "БЛОКАДА ОРМУЗА", 
        feb: 36.5, mar: 58.2,
        traders: [
          { name: "Fredi9999", win: "79%", pnl: "High-Volume" }
        ]
      }
    ],
    osint: [
      { 
        src: "SIGNAL_CONTEXT", 
        text: lang === 'EN' 
          ? "Monitoring KC-707 and CVN-72 movements. Data requires independent verification." 
          : "Мониторинг перемещения KC-707 и CVN-72. Данные требуют подтверждения." 
      },
      { 
        src: "POL_CONTEXT", 
        text: lang === 'EN' 
          ? "Market reacting to diplomatic visits in DC. Increasing USA-STRIKE volatility." 
          : "Рынок реагирует на визиты в Вашингтон. Рост волатильности USA-STRIKE." 
      }
    ]
  };

  const needleRotation = (threatIndex / 10) * 180 - 90;

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px', color: '#00ff41', fontFamily: 'monospace' }}>
      
      {/* HEADER: AGGREGATED THREAT GAUGE */}
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
          <div style={{ textAlign: 'center', marginTop: '-10px', fontSize: '24px', fontWeight: '900', color: '#ff003c' }}>{threatIndex}<span style={{fontSize: '12px'}}>/10</span></div>
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ fontSize: '10px', color: '#ff003c', marginBottom: '10px' }}>{lang === 'EN' ? "AGGREGATED THREAT INDEX (BETA)" : "СВОДНЫЙ ИНДЕКС УГРОЗЫ"}</div>
          <div style={{ fontSize: '11px', lineHeight: '1.4', color: '#888' }}>
            <strong style={{ color: '#fff' }}>{lang === 'EN' ? "WARNING:" : "ВНИМАНИЕ:"}</strong> {lang === 'EN' ? "This index is a mathematical average of market expectations and energy prices. It MUST NOT be used as a sole source for decision making." : "Этот индекс — расчетное усреднение. Его нельзя использовать как единственный источник."}
            <br /><br />
            <span style={{ color: '#ff003c' }}>{lang === 'EN' ? "REASON:" : "ПРИЧИНА:"}</span> {lang === 'EN' ? "Market reflects trader speculation, not classified military directives." : "Рынок отражает спекуляции трейдеров, а не военные планы."}
          </div>
        </div>
      </section>

      {/* ENERGY DATA: BUSINESS INSIDER SOURCE */}
      <section style={{ border: '1px solid #333', marginBottom: '30px', background: '#050505' }}>
        <div style={{ background: '#fff', color: '#000', padding: '10px 20px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
          <span>BUSINESS INSIDER // ENERGY MARKETS</span>
          <button onClick={() => setLang(lang === 'EN' ? 'RU' : 'EN')} style={{cursor:'pointer', fontWeight:'bold', border:'none', background:'none'}}>{lang}</button>
        </div>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ color: '#666', borderBottom: '1px solid #222' }}>
              <th style={{ padding: '12px' }}>TICKER</th>
              <th style={{ padding: '12px' }}>PRICE</th>
              <th style={{ padding: '12px' }}>CHANGE</th>
              <th style={{ padding: '12px' }}>LAST UPDATE</th>
            </tr>
          </thead>
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

      {/* POLYMARKET DATA MODULES */}
      <div style={{ marginBottom: '10px', fontSize: '12px', color: '#00ff41', fontWeight: 'bold' }}>// PREDICTION MARKET DATA (SOURCE: POLYMARKET)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {DATA.threats.map(m => (
          <div key={m.id} style={{ border: '1px solid #222', background: '#080808', padding: '20px' }}>
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
            {m.traders.map(t => (
              <div key={t.name} style={{ fontSize: '11px', color: '#fff', marginBottom: '4px' }}>
                {t.name} | Acc: <span style={{color: '#00ff41'}}>{t.win}</span> | PNL: <span style={{color: '#3b82f6'}}>{t.pnl}</span>
                {t.note && <div style={{color: '#ff003c', fontSize: '9px'}}>{t.note}</div>}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* OSINT FEED SECTION */}
      <footer style={{ border: '1px solid #ff003c', padding: '20px', background: '#0a0000' }}>
        <h3 style={{ color: '#ff003c', fontSize: '11px', margin: '0 0 15px 0' }}>// VERIFIED OSINT INTELLIGENCE FEED</h3>
        {DATA.osint.map((o, idx) => (
          <div key={idx} style={{ marginBottom: '8px', fontSize: '12px', color: '#fff' }}>
            <span style={{ color: '#666' }}>SOURCE: {o.src} // </span> {o.text}
          </div>
        ))}
      </footer>
    </div>
  );
}
