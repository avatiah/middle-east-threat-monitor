'use client';
import React, { useEffect, useState } from 'react';
import { ShieldAlert, Activity, Globe, Info } from 'lucide-react';
import config from '@/config/threats.json';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Запрос к Gamma API Polymarket
        const activeThreats = config.threats.filter(t => t.active);
        const results = await Promise.all(activeThreats.map(async (threat) => {
          const res = await fetch(`https://gamma-api.polymarket.com/markets/${threat.polyId}`);
          const market = await res.json();
          return {
            ...threat,
            prob: Math.round(parseFloat(market.outcomePrices[0]) * 100)
          };
        }));
        setData(results);
      } catch (e) {
        console.error("Ошибка загрузки данных", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (prob) => {
    if (prob < 20) return 'text-green-500 bg-green-500/10';
    if (prob < 50) return 'text-yellow-500 bg-yellow-500/10';
    if (prob < 75) return 'text-orange-500 bg-orange-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Загрузка разведданных...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8 font-mono">
      {/* Шапка */}
      <div className="max-w-6xl mx-auto mb-12 border-b border-green-900/30 pb-6">
        <h1 className="text-3xl font-bold text-green-500 flex items-center gap-3">
          <ShieldAlert size={36} /> GEOPOLITICAL THREAT MONITOR v1.0
        </h1>
        <p className="text-gray-500 mt-2">Анализ вероятностей на основе рынков предсказаний Polymarket</p>
      </div>

      {/* Сетка угроз */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((threat) => (
          <div key={threat.id} className="bg-[#111] border border-gray-800 p-6 rounded-lg hover:border-green-500/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">{threat.category}</span>
                <h3 className="text-xl font-bold">{threat.title}</h3>
              </div>
              <div className={`px-3 py-1 rounded text-sm font-bold ${getStatusColor(threat.prob)}`}>
                {threat.prob}%
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">{threat.description}</p>
            
            {/* Шкала визуализации */}
            <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${threat.prob > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${threat.prob}%` }}
              />
            </div>
            
            <div className="mt-4 flex justify-between items-center text-[10px] text-gray-600">
              <span className="flex items-center gap-1"><Activity size={12}/> LIVE DATA</span>
              <span>ID: {threat.polyId}</span>
            </div>
          </div>
        ))}
      </div>

      <footer className="max-w-6xl mx-auto mt-20 text-center text-gray-600 text-[10px] border-t border-gray-900 pt-8 uppercase tracking-[0.2em]">
        Независимый мониторинг | Данные обновляются в реальном времени
      </footer>
    </div>
  );
}
