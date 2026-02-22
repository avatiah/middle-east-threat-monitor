'use client';

import React, { useState } from 'react';
// Импортируем наш основной компонент ленты для единообразия дизайна
import { OsintFeed } from '../../../components/terminal/OsintFeed';

export default function SmartSandbox() {
  const [news, setNews] = useState<{src: string, text: string}[]>([]);
  const [status, setStatus] = useState('READY');
  const [loading, setLoading] = useState(false);

  // Твой личный ключ интегрирован
  const API_KEY = '4987948b76ab448e9d8d4d275951ba30'; 

  const fetchLiveOSINT = async () => {
    setLoading(true);
    setStatus('SCANNING_GLOBAL_SOURCES...');
    try {
      // Запрос к NewsAPI: ищем самые свежие новости на английском
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=Israel+Iran+military+OR+strike&apiKey=${API_KEY}&pageSize=5&language=en`
      );
      const data = await response.json();
      
      if (data.articles) {
        // Преобразуем формат NewsAPI в формат нашего терминала
        const formattedNews = data.articles.map((article: any) => ({
          src: article.source.name.toUpperCase(),
          text: article.title
        }));
        setNews(formattedNews);
        setStatus('SCAN_COMPLETE');
      } else {
        setStatus('ERROR: NO_ARTICLES_FOUND');
      }
    } catch (e) {
      console.error(e);
      setStatus('CONNECTION_FAILED');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '40px', color: '#00ff41', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '20px', margin: 0 }}>// OSINT_LIVE_SCANNER_V1.5</h1>
        <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
          CONNECTED_TO: NEWSAPI.ORG // API_STATUS: ACTIVE
        </div>
      </header>

      <div style={{ background: '#080808', border: '1px dashed #444', padding: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>
          SEARCH_QUERY: "Israel Iran military OR strike"
        </p>
        <button 
          onClick={fetchLiveOSINT}
          disabled={loading}
          style={{ 
            background: loading ? '#222' : '#00ff41', 
            color: '#000', 
            border: 'none', 
            padding: '15px 40px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '14px',
            letterSpacing: '1px'
          }}
        >
          {loading ? 'EXECUTING_SCAN...' : 'RUN_GLOBAL_SCAN'}
        </button>
        <div style={{ marginTop: '15px', fontSize: '10px', color: status.includes('ERROR') ? '#ff003c' : '#00ff41' }}>
          SYSTEM_STATUS: {status}
        </div>
      </div>

      {news.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '14px', color: '#fff', marginBottom: '10px' }}>// LIVE_INTEL_BUFFER:</h2>
          {/* Используем наш стандартный компонент OSINT */}
          <OsintFeed events={news} />
          
          <div style={{ marginTop: '20px', color: '#444', fontSize: '10px' }}>
            NOTE: CLICKING 'RUN_SCAN' AGAIN WILL REFRESH DATA FROM GLOBAL REPOSTORIES.
          </div>
        </div>
      )}

      <footer style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #111', fontSize: '10px', color: '#222' }}>
        DEVELOPMENT_SANDBOX // RAW_DATA_ONLY // SHIN_BET_AUDIT_PENDING
      </footer>
    </div>
  );
}
