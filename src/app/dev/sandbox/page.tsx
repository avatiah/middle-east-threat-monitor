'use client';

import React, { useState } from 'react';
// Используем относительный путь к ранее созданному модулю OSINT
import { OsintFeed } from '../../../components/terminal/OsintFeed';

export default function SandboxPage() {
  const [query, setQuery] = useState('Israel Iran escalation 2026');
  const [status, setStatus] = useState('IDLE');
  const [results, setResults] = useState<{src: string, text: string}[]>([]);

  // Функция для запроса к нашему Node.js Backend
  const handleSearch = async () => {
    setStatus('CONNECTING_TO_BACKEND...');
    
    try {
      // Пытаемся получить реальные данные из локального сервера
      const response = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) throw new Error('Backend error');
      
      const data = await response.json();
      setResults(data);
      setStatus('DATA_RECEIVED');
    } catch (error) {
      console.error("Connection failed:", error);
      
      // Фоллбек (запасной вариант), если сервер еще не запущен
      setStatus('BACKEND_OFFLINE_USING_MOCK_DATA');
      setTimeout(() => {
        setResults([
          { 
            src: "SANDBOX_INTERNAL", 
            text: `LOCAL_MODE: Server at port 3001 unreachable. Showing cached simulation for: ${query}` 
          },
          { 
            src: "INSS_SIMULATOR", 
            text: "Strategic tension index: 6.8. Increase in maritime signal activity detected near Hormuz." 
          }
        ]);
      }, 800);
    }
  };

  return (
    <div style={{ 
      background: '#000', 
      minHeight: '100vh', 
      padding: '40px', 
      color: '#00ff41', 
      fontFamily: 'monospace' 
    }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '18px', margin: 0 }}>// DATA_SANDBOX_V1.1</h1>
        <div style={{ 
          fontSize: '10px', 
          background: status.includes('OFFLINE') ? '#300' : '#030', 
          padding: '4px 8px',
          color: status.includes('OFFLINE') ? '#ff003c' : '#00ff41',
          border: `1px solid ${status.includes('OFFLINE') ? '#ff003c' : '#00ff41'}`
        }}>
          STATUS: {status}
        </div>
      </div>
      
      {/* SEARCH CONTROL PANEL */}
      <div style={{ margin: '30px 0', padding: '25px', border: '1px dashed #444', background: '#050505' }}>
        <p style={{ fontSize: '11px', color: '#888', marginBottom: '15px' }}>
          INPUT SOURCE PARAMETERS FOR DEEP-WEB SCANNERS AND NEWS AGGREGATORS:
        </p>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search keywords..."
            style={{ 
              background: '#000', 
              border: '1px solid #444', 
              color: '#00ff41', 
              padding: '12px', 
              flex: 1,
              outline: 'none',
              fontFamily: 'monospace'
            }}
          />
          <button 
            onClick={handleSearch}
            disabled={status === 'CONNECTING_TO_BACKEND...'}
            style={{ 
              background: '#00ff41', 
              color: '#000', 
              border: 'none', 
              padding: '0 30px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px',
              opacity: status === 'CONNECTING_TO_BACKEND...' ? 0.5 : 1
            }}
          >
            RUN_SCAN
          </button>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      {results.length > 0 && (
        <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '14px', color: '#fff', margin: 0 }}>// SCAN_RESULTS_BUFFER:</h2>
            <span style={{ fontSize: '10px', color: '#666' }}>{results.length} ENTRIES FOUND</span>
          </div>
          
          <OsintFeed events={results} />
          
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <button 
              onClick={() => alert('Sending to verification pool...')}
              style={{ 
                background: 'none', 
                border: '1px solid #00ff41', 
                color: '#00ff41', 
                padding: '10px 20px', 
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              APPROVE_FOR_TERMINAL
            </button>
            <button 
              onClick={() => setResults([])}
              style={{ 
                background: 'none', 
                border: '1px solid #ff003c', 
                color: '#ff003c', 
                padding: '10px 20px', 
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              DISCARD_SIGNAL
            </button>
          </div>
        </div>
      )}

      {/* INFO FOOTER */}
      <footer style={{ marginTop: '60px', borderTop: '1px solid #111', paddingTop: '20px', fontSize: '10px', color: '#333' }}>
        <p>CAUTION: DATA IN SANDBOX MODE IS UNFILTERED. SOURCE CREDIBILITY MUST BE VERIFIED LOCALLY BEFORE DEPLOYMENT TO MAIN TERMINAL AUDIT.</p>
        <p>PROJECT: THREAT_ENGINE // SESSION_TYPE: RESEARCH_DEVELOPMENT</p>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
