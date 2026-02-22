'use client';

import React from 'react';
import { ThreatGauge } from '@/components/terminal/ThreatGauge';
import { EnergyTable } from '@/components/terminal/EnergyTable';
import { ThreatCard } from '@/components/terminal/ThreatCard';

export default function ThreatTerminal() {
  // ДАННЫЕ ВЫНЕСЕНЫ ИЗ КОМПОНЕНТОВ ДЛЯ УДОБСТВА АУДИТА
  const energyData = [
    { name: "Oil (Brent)", price: 71.49, change: -0.63, time: "04:46 AM" },
    { name: "Oil (WTI)", price: 66.05, change: -0.57, time: "04:55 AM" },
    { name: "Coal (API2)", price: 116.70, change: 1.25, time: "LIVE" },
    { name: "Natural Gas", price: 2.98, change: -0.43, time: "04:55 AM" }
  ];

  const threatModules = [
    { 
      id: "ISR-IRN", title: "ISRAEL STRIKE ON IRAN", feb: 27, mar: 59,
      traders: [{ name: "RicoSauve666", win: "95%", pnl: "~$154,219", note: "Status: Under Investigation" }]
    },
    { 
      id: "USA-STRIKE", title: "USA MILITARY INTERVENTION", feb: 28, mar: 62,
      traders: [{ name: "Rundeep", win: "76.4%", pnl: "Professional" }]
    }
  ];

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px', color: '#00ff41', fontFamily: 'monospace' }}>
      <header style={{ marginBottom: '20px', fontSize: '12px' }}>// SYSTEM STATUS: EN_STRICT_MODE // VERIFIED_DATA_ONLY</header>
      
      <ThreatGauge value={6.5} />
      
      <EnergyTable data={energyData} />

      <div style={{ marginBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>// SOURCE: POLYMARKET</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {threatModules.map(m => <ThreatCard key={m.id} m={m} />)}
      </div>
    </div>
  );
}
