{/* Секция временных горизонтов с восстановленным выводом и детектором всплесков */}
<div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
  
  {/* Горизонт 1: Февраль 28 (Восстановлен) */}
  <div style={{ 
    flex: 1, 
    background: '#050505', 
    padding: '15px', 
    border: n.spike_short ? '2px solid #00ff41' : '1px solid #1e293b', // Подсветка при всплеске
    boxShadow: n.spike_short ? '0 0 10px #00ff41' : 'none'
  }}>
    <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>Февраль 28</div>
    <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob_short > 20 ? '#ff003c' : '#3b82f6' }}>
      {n.prob_short}% 
    </div>
  </div>
  
  {/* Горизонт 2: Март 31 */}
  <div style={{ 
    flex: 1, 
    background: '#050505', 
    padding: '15px', 
    border: n.spike_long ? '2px solid #00ff41' : '1px solid #1e293b', // Подсветка при всплеске
    boxShadow: n.spike_long ? '0 0 10px #00ff41' : 'none'
  }}>
    <div style={{ fontSize: '9px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase' }}>Март 31</div>
    <div style={{ fontSize: '32px', fontWeight: 'bold', color: n.prob > 40 ? '#ff003c' : '#3b82f6' }}>
      {n.prob}%
    </div>
  </div>

</div>
