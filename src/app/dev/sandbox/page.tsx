'use client';

import React, { useState } from 'react';
import { OsintFeed } from '../../../components/terminal/OsintFeed';

export default function SmartSandbox() {
  const [query, setQuery] = useState('Israel Iran military strike'); // Поисковый запрос
  const [news, setNews] = useState<{src: string, text: string}[]>([]);
  const [status, setStatus] = useState('READY');
  const [loading, setLoading] = useState(false);

  // ТВОЙ КЛЮЧ: 4987948b76ab448e9d8d4d275951ba30
  const API_KEY = '4987948b76ab448e9d8d4d275951ba30'; 

  const handleScan = async () => {
    setLoading(true);
    setStatus('SCANNING_GLOBAL_NEWS_API...');
    
    try {
      // Прямой запрос к NewsAPI без участия лишних серверов
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}&pageSize=5&language=en`
      );
      const data = await response.json();
      
      if (data.status === "ok" && data.articles.length > 0) {
        // Форматируем данные под наш стиль OSINT Feed
        const liveIntel = data.articles.map((a: any) => ({
          src: a.source.name.toUpperCase(),
          text: a.title
        }));
        setNews(liveIntel);
        setStatus('LIVE_INTEL_RECEIVED');
      } else {
        setStatus('NO_SIGNALS_FOUND_FOR_QUERY');
      }
    } catch (error) {
      console.error("Scan failed:", error);
      setStatus('CONNECTION_ERROR_CHECK_KEY');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '40px', color: '#00ff41', fontFamily: 'monospace' }}>
      {/* Шапка из твоего скриншота */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '18px', margin: 0 }}>// DATA_SANDBOX_V1.1_LIVE</h1>
        <div style={{ fontSize: '10px', border: '1px solid #ff003c', padding: '4px 8px', color: '#ff003c' }}>
          STATUS: {status}
        </div>
      </div>
      
      {/* Панель управления поиском */}
      <div style={{ margin: '30px 0', padding: '25px', border: '1px dashed #444', background: '#050505' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ background: '#000', border: '1px solid #444', color: '#00ff41', padding: '12px', flex: 1, outline: 'none', fontFamily: 'monospace' }}
          />
          <button 
            onClick={handleScan}
            disabled={loading}
            style={{ background: '#00ff41', color: '#000', border: 'none', padding: '0 30px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'EXECUTING...' : 'RUN_SCAN'}
          </button>
        </div>
      </div>

      {/* Вывод результатов (компонент из Шага 6) */}
      {news.length > 0 && (
        <div>
          <h2 style={{ fontSize: '14px', color: '#fff', marginBottom: '10px' }}>// SCAN_RESULTS_BUFFER:</h2>
          <OsintFeed events={news} />
          
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <button style={{ background: 'none', border: '1px solid #00ff41', color: '#00ff41', padding: '10px 20px', cursor: 'pointer', fontSize: '11px' }}>
              APPROVE_FOR_TERMINAL
            </button>
            <button style={{ background: 'none', border: '1px solid #ff003c', color: '#ff003c', padding: '10px 20px', cursor: 'pointer', fontSize: '11px' }}>
              DISCARD_SIGNAL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
