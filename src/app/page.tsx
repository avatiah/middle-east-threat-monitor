'use client';
import React, { useEffect, useState } from 'react';

export default function UltimateIntelOS() {
  const [nodes, setNodes] = useState<any[]>([]);

  const sync = async () => {
    const res = await fetch('/api/threats');
    const data = await res.json();
    if (Array.isArray(data)) setNodes(data);
  };

  useEffect(() => { sync(); const i = setInterval(sync, 5000); return () => clearInterval(i); }, []);

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      
      {/* HEADER: ТЕКУЩИЙ СТАТУС СИСТЕМЫ */}
      <div style={{ border: '1px solid #0f0', padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>STRATEGIC_OS_V24.0 // INFINITY_MONITOR</div>
          <div style={{ fontSize: '9px', opacity: 0.6 }}>ДАННЫЕ ОСНОВАНЫ НА РЫНКАХ ПРЕДСКАЗАНИЙ (REAL-MONEY SENTIMENT)</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '32px', color: '#f00' }}>{nodes.length ? Math.max(...nodes.map(n=>n.prob)) : 0}%</div>
          <div style={{ fontSize: '9px' }}>ПИКОВЫЙ УРОВЕНЬ УГРОЗЫ</div>
        </div>
      </div>

      {/* ГРИД ДАННЫХ С РАЗЪЯСНЕНИЯМИ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ border: '1px solid #333', padding: '15px', background: '#050505' }}>
            <div style={{ fontSize: '10px', color: '#555', marginBottom: '5px' }}>NODE_ID: {n.id}</div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: n.prob > 40 ? '#f00' : '#0f0' }}>{n.prob}%</div>
            <div style={{ fontSize: '10px', color: '#fff', marginBottom: '10px' }}>{n.desc}</div>
            <div style={{ fontSize: '8px', borderTop: '1px solid #222', paddingTop: '5px', color: '#0f0' }}>
              ЗАЧЕМ ЭТО: Отражает уверенность инвесторов в начале конфликта. Рост {'>'} 45% = неизбежность.
            </div>
          </div>
        ))}
      </div>

      {/* ТАБЛИЦА С МАКСИМУМОМ ИНФОРМАЦИИ */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <div style={{ fontSize: '12px', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
            DEEP_DATA_ANALYTICS // КТО И СКОЛЬКО СТАВИТ НА КОНФЛИКТ
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr style={{ textAlign: 'left', opacity: 0.5 }}>
                <th style={{ padding: '8px' }}>УЗЕЛ</th>
                <th style={{ padding: '8px' }}>ОБЪЕМ (USD)</th>
                <th style={{ padding: '8px' }}>ЛИКВИДНОСТЬ</th>
                <th style={{ padding: '8px' }}>КРУПНЫЙ ИГРОК</th>
                <th style={{ padding: '8px' }}>ВЛИЯНИЕ</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((n, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{n.id}</td>
                  <td style={{ padding: '10px' }}>{n.vol}</td>
                  <td style={{ padding: '10px' }}>{n.liq}</td>
                  <td style={{ padding: '10px', color: '#ffaa00' }}>{n.trader}</td>
                  <td style={{ padding: '10px', color: n.prob > 40 ? '#f00' : '#888' }}>{n.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ border: '1px solid #0f0', padding: '20px', background: '#050505' }}>
          <div style={{ fontSize: '12px', marginBottom: '10px' }}>ЧТО ЭТО ЗНАЧИТ? (FAQ)</div>
          <div style={{ fontSize: '10px', color: '#888', lineHeight: '1.4' }}>
            <p><b style={{color:'#0f0'}}>% Вероятности:</b> Это не гадание. Это цена акции на рынке Polymarket. Если она 46%, значит "рынок" готов платить 46 центов за 1 доллар прибыли в случае войны.</p>
            <p><b style={{color:'#0f0'}}>GC_WHALE_01:</b> Профиль топ-трейдера с прибылью более $2M. Его активность — самый точный индикатор инсайда.</p>
            <p><b style={{color:'#0f0'}}>Объем:</b> Чем больше денег в узле, тем сложнее манипулировать процентом. Миллионные объемы подтверждают серьезность угрозы.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
