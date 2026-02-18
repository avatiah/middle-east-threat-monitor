// src/app/page.tsx

{/* Исправленный блок отображения временных горизонтов внутри карточки модуля */}
<div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
  {/* Первый горизонт: Февраль 28 */}
  <div style={{ flex: 1, background: '#050505', padding: '15px', border: '1px solid #1e293b' }}>
    <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>Февраль 28</div>
    <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob_short > 20 ? '#ff003c' : '#3b82f6' }}>
      {n.prob_short}%
    </div>
  </div>
  
  {/* Второй горизонт: Март 31 */}
  <div style={{ flex: 1, background: '#050505', padding: '15px', border: '1px solid #1e293b' }}>
    <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>Март 31</div>
    <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob > 40 ? '#ff003c' : '#3b82f6' }}>
      {n.prob}%
    </div>
  </div>
</div>
