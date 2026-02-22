'use client';

import React from 'react';
import { ThreatGauge } from '@/components/terminal/ThreatGauge';
import { EnergyTable } from '@/components/terminal/EnergyTable';
import { ThreatCard } from '@/components/terminal/ThreatCard';
import { OsintFeed } from '@/components/terminal/OsintFeed'; // ИМПОРТ НОВОГО МОДУЛЯ

export default function ThreatTerminal() {
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
    },
    { 
      id: "HORMUZ-BLOCK", title: "HORMUZ STRAIT BLOCKADE", feb: 36.5, mar: 58.2,
      traders: [{ name: "Fredi9999", win: "79%", pnl: "High-Volume" }]
    }
  ];

  // ДАННЫЕ ДЛЯ НОВОГО МОДУЛЯ OSINT
  const osintData = [
    { 
      src: "SIGNAL_CONTEXT", 
      text: "Monitoring KC-707 and CVN-72 movements. Data requires independent verification." 
    },
    { 
      src: "POL_CONTEXT", 
      text: "Market reacting to diplomatic visits in DC. Increasing USA-STRIKE volatility." 
    }
  ];

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px', color: '#00ff41', fontFamily: 'monospace' }}>
      <header style={{ marginBottom: '20px', fontSize: '12px', color: '#666' }}>
        // SYSTEM STATUS: EN_STRICT_MODE // VERIFIED_DATA_ONLY
      </header>
      
      {/* 1. Индекс */}
      <ThreatGauge value={6.5} />
      
      {/* 2. Энергетика */}
      <EnergyTable data={energyData} />

      {/* 3. Полимаркет */}
      <div style={{ marginBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>
        // SOURCE: POLYMARKET (PREDICTION DATA)
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {threatModules.map(m => <ThreatCard key={m.id} m={m} />)}
      </div>

      {/* 4. ОСИНТ ЛЕНТА */}
      <OsintFeed events={osintData} />
      
    </div>
  );
}
