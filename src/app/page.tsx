'use client';
import React, { useEffect, useState } from 'react';

export default function UserCentricIntelligence() {
  const [data, setData] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  const sync = async () => {
    const res = await fetch('/api/threats');
    const json = await res.json();
    if (Array.isArray(json)) setData(json);
  };

  useEffect(() => { 
    sync(); 
    setInterval(sync, 4000); 
    setInterval(() => setNow(Date.now()), 1000);
  }, []);

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '30px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '30px', borderBottom: '2px solid #2563eb', paddingBottom: '15px' }}>
          <h1 style={{ margin: 0, color: '#1e293b' }}>Мониторинг Мировой Стабильности</h1>
          <p style={{ color: '#64748b', margin: '5px 0' }}>Данные основаны на реальных ставках крупнейших инвесторов мира</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
          {data.map(n => (
            <div key={n.id} style={{ background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' }}>ПРОВЕРЕНО {Math.floor((now - n.updated)/1000)} СЕК. НАЗАД</span>
                <span style={{ fontSize: '12px', padding: '4px 10px', background: '#f1f5f9', borderRadius: '20px' }}>{n.id === 'HORMUZ' ? 'До конца 2026' : 'До весны 2026'}</span>
              </div>
              <h2 style={{ fontSize: '18px', margin: '15px 0', color: '#334155' }}>{n.desc}</h2>
              <div style={{ fontSize: '64px', fontWeight: '900', color: n.prob > 30 ? '#dc2626' : '#1e293b' }}>{n.prob}%</div>
              <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>АКТИВНОСТЬ ЛИДЕРА ({n.trader}):</div>
                <b style={{ color: '#2563eb' }}>{n.accuracy}% точность прогнозов</b>
              </div>
            </div>
          ))}
        </div>

        <section style={{ marginTop: '40px', background: '#1e293b', borderRadius: '20px', padding: '30px', color: '#fff' }}>
          <h2 style={{ color: '#3b82f6', marginTop: 0 }}>Анализ действий «Китов» (Крупнейшие игроки)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div style={{ borderRight: '1px solid #334155', paddingRight: '20px' }}>
              <h3 style={{ color: '#10b981' }}>RicoSauve666</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1' }}>Владеет активами на $12.4 млн. Никогда не ошибался в крупных конфликтах последних двух лет.</p>
            </div>
            <div style={{ borderRight: '1px solid #334155', paddingRight: '20px' }}>
              <h3 style={{ color: '#10b981' }}>GC_WHALE_01</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1' }}>Инсайдерская стратегия. Поставил $142,000 на операцию в Ливане, что вызвало резкий рост вероятности.</p>
            </div>
            <div>
              <h3 style={{ color: '#10b981' }}>Rundeep</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1' }}>Специалист по авиаударам. Его активность всегда предшествует реальным военным действиям.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
