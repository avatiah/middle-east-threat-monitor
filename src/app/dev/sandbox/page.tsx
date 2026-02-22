'use client';

import React, { useState, useEffect } from 'react';
// Импортируем существующий модуль OSINT для отображения результатов теста
import { OsintFeed } from '../../../components/terminal/OsintFeed';

export default function SandboxPage() {
  const [query, setQuery] = useState('Israel Iran escalation 2026');
  const [status, setStatus] = useState('IDLE');
  const [results, setResults] = useState<{src: string, text: string}[]>([]);

  // Имитация поиска новых данных (здесь в будущем будет fetch к твоему серверу)
  const handleSearch = async () => {
    setStatus('SEARCHING_SOURCES...');
    
    // Симуляция задержки и получения данных (включая INSS контекст)
    setTimeout(() => {
      const mockData = [
        { 
          src: "SANDBOX_INSS_PREDICT", 
          text: "Analytic shift: INSS reports 15% increase in regional tension metrics. (Simulated)" 
        },
        { 
          src: "SANDBOX_LIVE_SIGNAL", 
          text: `Found new mentions for query: "${query}" in military aviation logs.` 
        }
      ];
      setResults(mockData);
      setStatus('DONE');
    }, 1500);
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '40px', color: '#00ff41', fontFamily: 'monospace' }}>
      <h1 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>// DATA_SANDBOX_V1.0</h1>
      
      <div style={{ margin: '30px 0', padding: '20px', border: '1px dashed #444', background: '#050505' }}>
        <p style={{ fontSize: '12px', color: '#888' }}>USE THIS AREA TO TEST NEW DATA STREAMS BEFORE INTEGRATION.</p>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ 
              background: '#000', 
              border: '1px solid #00ff41', 
              color: '#00ff41', 
              padding: '10px', 
              flex: 1,
              fontFamily: 'monospace'
            }}
          />
          <button 
            onClick={handleSearch}
            style={{ 
              background: '#00ff41', 
              color: '#000', 
              border: 'none', 
              padding: '10px 20px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {status === 'SEARCHING_SOURCES...' ? 'WAIT...' : 'FETCH_TEST_DATA'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div>
          <h2 style={{ fontSize: '14px', color: '#fff' }}>// TEST_RESULTS_PREVIEW:</h2>
          <OsintFeed events={results} />
          
          <button 
            onClick={() => alert('Integration logic will be here.')}
            style={{ 
              marginTop: '20px', 
              background: 'none', 
              border: '1px solid #3b82f6', 
              color: '#3b82f6', 
              padding: '10px', 
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            PUSH_TO_MAIN_TERMINAL_AUDIT
          </button>
        </div>
      )}

      <footer style={{ marginTop: '50px', fontSize: '10px', color: '#333' }}>
        SANDBOX MODE // NO LIVE TRADING DECISIONS // SOURCE_VERIFICATION_REQUIRED
      </footer>
    </div>
  );
}
