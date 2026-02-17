'use client';
import React, { useEffect, useState } from 'react';

export default function IntelDashboardV24() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => { 
    const sync = async () => {
      const res = await fetch('/api/threats');
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    };
    sync(); const i = setInterval(sync, 5000); return () => clearInterval(i); 
  }, []);

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', padding: '25px', fontFamily: 'monospace' }}>
      
      {/* HEADER */}
      <div style={{ border: '1px solid #0f0', padding: '20px', marginBottom: '20px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>STRATEGIC_INTELLIGENCE_OS // V24.5</div>
        <div style={{ fontSize: '10px', opacity: 0.6 }}>STATUS: UPLINK_ACTIVE // TARGET: POLYMARKET_REALTIME</div>
      </div>

      {/* SENSORS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        {data.map((n, i) => (
          <div key={i} style={{ border: '1px solid #333', padding: '15px', background: '#050505' }}>
            <div style={{ fontSize: '10px', color: '#555' }}>NODE: {n.id}</div>
            <div style={{ fontSize: '52px', fontWeight: 'bold', color: n.prob > 40 ? '#f00' : '#0f0' }}>{n.prob}%</div>
            <div style={{ fontSize: '9px', color: '#888' }}>ВЕРОЯТНОСТЬ СОБЫТИЯ ПО РЫНКУ</div>
          </div>
        ))}
      </div>

      {/* РАЗЪЯСНЕНИЕ ДАННЫХ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <h3 style={{ marginTop: 0, color: '#0f0' }}>ЧТО ОЗНАЧАЮТ ЭТИ ЦИФРЫ?</h3>
          <div style={{ fontSize: '12px', lineHeight: '1.6', color: '#ccc' }}>
            <p><b>1. Проценты (%):</b> Это не прогноз погоды и не мнение одного эксперта. Это «цена предсказания» на бирже. Если стоит <b>46%</b>, значит тысячи трейдеров во всем мире ставят миллионы долларов на то, что это произойдет. Чем выше %, тем ближе реальное начало конфликта.</p>
            <p><b>2. Уровни опасности (DEFCON):</b>
              <br/>• <span style={{color:'#0f0'}}>Зеленый (0-25%)</span>: Обычный новостной шум.
              <br/>• <span style={{color:'#ffaa00'}}>Оранжевый (26-40%)</span>: Реальная подготовка, стягивание сил.
              <br/>• <span style={{color:'#f00'}}>Красный (41%+)</span>: Критическая фаза. Инсайдеры и крупные игроки уверены в ударе.
            </p>
            <p><b>3. Крупный игрок (GC_WHALE_01):</b> Это кошелек профессионального трейдера, который почти не ошибается (WinRate 88%). Если вы видите его подпись — значит, «умные деньги» уже вошли в сделку.</p>
          </div>
        </div>

        <div style={{ border: '1px solid #0f0', padding: '20px', background: '#080808' }}>
          <h3 style={{ marginTop: 0, color: '#0f0' }}>ЗАЧЕМ ЭТО НУЖНО?</h3>
          <div style={{ fontSize: '12px', lineHeight: '1.6', color: '#ccc' }}>
            <p>Традиционные СМИ часто опаздывают или искажают информацию. Данные рынков предсказаний (Polymarket) — это самый быстрый способ узнать правду, потому что там <b>люди отвечают за свои слова деньгами</b>.</p>
            <p>Если вы видите резкий скачок процентов (например, с 14% до 30% за час) — это сигнал о том, что произошло важное закрытое событие, которое еще не попало в новости.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
