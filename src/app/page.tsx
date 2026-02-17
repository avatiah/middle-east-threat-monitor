'use client';
import React, { useEffect, useState } from 'react';

export default function V26DynamicOS() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [lastSync, setLastSync] = useState<string>("");
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/threats');
      const data = await res.json();
      if (data.error) throw new Error();
      setNodes(data);
      setLastSync(new Date().toLocaleTimeString());
      setIsError(false);
    } catch (e) {
      setIsError(true);
    }
  };

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 3000); return () => clearInterval(i); }, []);

  return (
    <div style={{ background: '#f1f5f9', color: '#1e293b', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' }}>
      
      {/* ПАНЕЛЬ СТАТУСА (СВЕТЛАЯ) */}
      <div style={{ border: '2px solid #334155', padding: '15px', marginBottom: '25px', borderRadius: '12px', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0 }}>INTELLIGENCE_STREAM_V26.0</h1>
            <div style={{ color: isError ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
              {isError ? '● ПОТОК ПРЕРВАН: ОЖИДАНИЕ ОБНОВЛЕНИЯ' : `● СИГНАЛ СТАБИЛЕН: ${lastSync}`}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px' }}>ИСТОЧНИК: DIRECT_POL_API_V2</div>
            <div style={{ fontSize: '10px', opacity: 0.5 }}>БЕЗ ИСПОЛЬЗОВАНИЯ КЭША</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>NODE: {n.id}</div>
            <div style={{ fontSize: '64px', fontWeight: 'bold', color: n.prob > 40 ? '#ef4444' : '#3b82f6' }}>{n.prob}%</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', margin: '10px 0' }}>ДЕДЛАЙН: {n.timeframe}</div>
            <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.4' }}>{n.detail}</div>
            
            <div style={{ marginTop: '15px', background: '#f8fafc', padding: '8px', borderRadius: '6px', fontSize: '10px' }}>
              <b>VOL_LIVE:</b> ${Math.round(n.volume).toLocaleString()} USD
            </div>
          </div>
        ))}
      </div>

      {/* ПОДРОБНОЕ РАЗЪЯСНЕНИЕ */}
      <div style={{ marginTop: '30px', padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
        <h3 style={{ marginTop: 0 }}>ИНТЕРПРЕТАЦИЯ РЕАЛЬНЫХ ДАННЫХ</h3>
        <p style={{ fontSize: '13px' }}>
          Если вы видите, что данные не меняются несколько минут — это значит на рынке Polymarket нет новых сделок. 
          <b>Объем (VOL_LIVE)</b> — лучший индикатор. Если он растет, а процент стоит на месте, значит крупные игроки "удерживают" уровень. 
          В этой версии <b>полностью исключены заглушки</b>: если API пришлет 0%, вы увидите 0%.
        </p>
      </div>
    </div>
  );
}
