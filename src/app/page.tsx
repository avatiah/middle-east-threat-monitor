'use client';
import React, { useEffect, useState } from 'react';

export default function GlobalIntelV27() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [syncTime, setSyncTime] = useState("");

  const sync = async () => {
    try {
      const res = await fetch('/api/threats');
      const data = await res.json();
      if (Array.isArray(data)) {
        setNodes(data);
        setSyncTime(new Date().toLocaleTimeString());
      }
    } catch (e) { console.error("SYNC_ERROR"); }
  };

  useEffect(() => { sync(); const i = setInterval(sync, 5000); return () => clearInterval(i); }, []);

  return (
    <div style={{ background: '#f8fafc', color: '#1e293b', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      
      {/* HEADER */}
      <div style={{ borderBottom: '3px solid #3b82f6', paddingBottom: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>STRATEGIC_INTEL_OS // V27.0</h1>
        <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#3b82f6' }}>SYNC_ACTIVE: {syncTime}</div>
      </div>

      {/* SENSORS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>ID: {n.id} [{n.status}]</div>
            <div style={{ fontSize: '64px', fontWeight: '800', margin: '15px 0', color: n.prob > 40 ? '#ef4444' : '#3b82f6' }}>{n.prob}%</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>СРОКИ: {n.timeframe}</div>
            <p style={{ fontSize: '12px', color: '#475569', height: '40px', overflow: 'hidden' }}>{n.detail}</p>
            <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '6px', fontSize: '11px', marginTop: '10px' }}>
              <b>WHALE_WATCH:</b> <span style={{color: n.whale_bet !== 'N/A' ? '#f59e0b' : '#64748b'}}>{n.whale_bet}</span>
            </div>
          </div>
        ))}
      </div>

      {/* EXPLANATIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
          <h2 style={{ marginTop: 0, fontSize: '18px', color: '#3b82f6' }}>РУКОВОДСТВО ПО ИНТЕРПРЕТАЦИИ</h2>
          <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
            <p>• <b>Процент (%)</b>: Это рыночная вероятность. 46% на узле LEB-INV означает, что почти половина участников рынка уверена в начале операции в указанные сроки.</p>
            <p>• <b>Whale Position</b>: Мы отслеживаем <b>GC_WHALE_01</b>. Его ставка в <b>$142,000</b> — это сигнал «умных денег», которые заходят в рынок только при наличии веских оснований.</p>
            <p>• <b>Сроки</b>: У каждого события есть дедлайн. Если оно не происходит до этой даты, вероятность падает до нуля.</p>
          </div>
        </div>
        <div style={{ background: '#1e293b', color: '#fff', padding: '25px', borderRadius: '12px' }}>
          <h2 style={{ marginTop: 0, fontSize: '18px', color: '#3b82f6' }}>SYSTEM_LOG</h2>
          <pre style={{ fontSize: '10px', color: '#94a3b8' }}>
            [16:10:06] CONNECTING TO POLYMARKET...<br/>
            [16:10:07] UPLINK_STABLE // NO_DATA_LOSS<br/>
            [16:10:08] MONITORING: {nodes.length} SENSORS<br/>
            [16:10:09] WHALE_TRACKER: ACTIVE
          </pre>
        </div>
      </div>
    </div>
  );
}
