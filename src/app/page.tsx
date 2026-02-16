'use client';
import React, { useEffect, useState } from 'react';
import { ShieldAlert, Activity, AlertTriangle, Zap } from 'lucide-react';
import config from '@/config/threats.json';

export default function ThreatDashboard() {
  const [data, setData] = useState([]);
  const [threatIndex, setThreatIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const activeThreats = config.threats.filter(t => t.active);
      
      const results = await Promise.all(activeThreats.map(async (threat) => {
        try {
          // Используем фильтр по slug в параметрах запроса
          const response = await fetch(
            `https://gamma-api.polymarket.com/markets?slug=${threat.slug}`,
            { method: 'GET', headers: { 'Accept': 'application/json' } }
          );
          
          const marketData = await response.json();
          
          // API возвращает массив. Проверяем, что он не пуст.
          if (marketData && marketData.length > 0) {
            const market = marketData[0];
            const prob = Math.round(parseFloat(market.outcomePrices[0]) * 100);
            return { ...threat, prob, active: true };
          }
          return { ...threat, prob: 0, active: false };
        } catch (err) {
          return { ...threat, prob: 0, error: true };
        }
      }));

      setData(results);
      const validResults = results.filter(r => r.prob > 0);
      if (validResults.length > 0) {
        setThreatIndex(Math.round(validResults.reduce((a, b) => a + b.prob, 0) / validResults.length));
      }
    } catch (e) {
      console.error("System Error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Обновление каждые 5 мин
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black text-green-500 flex items-center justify-center font-mono">
      <div className="animate-pulse">_LOADING_SYSTEM_DATA...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <header className="border-b border-green-900/50 pb-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-green-500 flex items-center gap-2">
              <ShieldAlert className="animate-pulse" /> MIDDLE_EAST_RISK_ENGINE
            </h1>
            <p className="text-xs text-gray-600 mt-1 uppercase tracking-widest">Data Source: Polymarket API | 2026_UNIT_72</p>
          </div>
          <div className="bg-green-950/20 border border-green-500/30 p-4 rounded-none min-w-[200px]">
            <div className="text-[10px] text-green-700 uppercase mb-1">Total Risk Index</div>
            <div className="text-4xl font-black text-green-500">{threatIndex}%</div>
          </div>
        </header>

        {/* RISK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-900 border border-gray-900">
          {data.map((threat) => (
            <div key={threat.id} className="bg-black p-6 flex flex-col justify-between group hover:bg-green-950/5 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] px-2 py-0.5 border border-gray-800 text-gray-500 uppercase tracking-tighter">
                    Sector: {threat.category}
                  </span>
                  <div className={`text-xl font-bold ${threat.prob > 40 ? 'text-red-500' : 'text-green-500'}`}>
                    {threat.prob}%
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 uppercase italic">{threat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{threat.description}</p>
              </div>

              <div>
                {/* Visual Bar */}
                <div className="h-1 w-full bg-gray-900 mb-2">
                  <div 
                    className={`h-full transition-all duration-1000 ${threat.prob > 40 ? 'bg-red-600' : 'bg-green-600'}`}
                    style={{ width: `${threat.prob}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-gray-700 uppercase">
                  <span className="flex items-center gap-1"><Zap size={10} /> Live_Feed</span>
                  <span>Probability_Assessment</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ADMIN NOTE */}
        <footer className="mt-12 pt-6 border-t border-gray-900">
          <div className="flex items-center gap-2 text-gray-700 text-[10px] uppercase">
            <AlertTriangle size={12} />
            <span>Admin Note: Update threats.json to enable/disable specific vectors</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
