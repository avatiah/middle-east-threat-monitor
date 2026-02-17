'use client';
import React, { useEffect, useState } from 'react';

export default function V25BrightOS() {
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    const sync = async () => {
      const res = await fetch('/api/threats');
      const data = await res.json();
      if (Array.isArray(data)) setNodes(data);
    };
    sync(); const i = setInterval(sync, 10000); return () => clearInterval(i);
  }, []);

  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '30px', fontFamily: 'Inter, monospace' }}>
      
      {/* HEADER */}
      <div style={{ borderBottom: '2px solid #38bdf8', paddingBottom: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '1px' }}>STRATEGIC_OS_V25.0 // <span style={{color: '#38bdf8'}}>BRIGHT_INTELLIGENCE</span></h1>
        <div style={{ background: '#38bdf8', color: '#0f172a', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px' }}>UPLINK_STABLE</div>
      </div>

      {/* PRIMARY NODES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '10px' }}>
              <span>ID: {n.id}</span>
              <span style={{ color: n.prob > 35 ? '#ef4444' : '#10b981' }}>{n.prob > 35 ? 'CRITICAL' : 'MONITOR'}</span>
            </div>
            
            <div style={{ fontSize: '64px', fontWeight: '800', margin: '10px 0', color: n.prob > 35 ? '#ef4444' : '#38bdf8' }}>{n.prob}%</div>
            
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>СРОКИ: {n.timeframe}</div>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 15px 0', lineHeight: '1.4' }}>{n.detail}</p>
            
            {/* WHALE INDICATOR */}
            <div style={{ background: '#0f172a', padding: '10px', borderRadius: '4px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 'bold' }}>WHALE_WATCH: {n.trader_id}</div>
              <div style={{ fontSize: '12px', color: n.trader_id !== 'N/A' ? '#fbbf24' : '#475569' }}>
                СТАВКА: {n.whale_position}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* WHALE LOG & DATA EXPLANATION */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '16px', color: '#38bdf8', marginTop: 0 }}>ГЛОССАРИЙ И РАЗЪЯСНЕНИЕ ДАННЫХ</h2>
          <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1' }}>
            <p>• <b>Процент (%)</b> — Это рыночная цена вероятности. Если по удару США стоит <b>14%</b>, значит рынок оценивает этот риск как умеренный на текущий момент. Резкий рост до 25%+ будет сигналом о поступлении инсайда.</p>
            <p>• <b>Whale Position</b> — Конкретная сумма, поставленная крупнейшим игроком (китом). Мы отслеживаем <b>GC_WHALE_01</b>, так как его заходы в рынок LEB-INV на уровне 142k USD подтверждают серьезность ситуации.</p>
            <p>• <b>Timeframe (Сроки)</b> — Каждое событие ограничено датой экспирации контракта на Polymarket. Если событие не происходит до указанной даты, вероятность обнуляется.</p>
          </div>
        </div>

        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '16px', color: '#38bdf8', marginTop: 0 }}>SYSTEM_STATS</h2>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            REFRESH_RATE: 10,000ms<br/>
            SOURCE: POLYMARKET_V2_API<br/>
            GEO_FOCUS: MIDDLE_EAST / IRAN<br/>
            DATE: 17.02.2026
          </div>
        </div>
      </div>
    </div>
  );
}
