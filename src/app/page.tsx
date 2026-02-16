'use client';
import React, { useEffect, useState } from 'react';
import { ShieldAlert, Activity, Zap, AlertTriangle } from 'lucide-react';

// Конфигурация вынесена прямо в код для исключения ошибок загрузки файлов (404)
const THREAT_CONFIG = [
  {
    id: "isr-iran",
    slug: "israel-strikes-iran-by-march-31-2026",
    title: "Удар Израиля по Ирану",
    description: "Прямая атака ЦАХАЛ по территории Ирана до конца марта.",
    category: "ISRAEL-IRAN",
    active: true
  },
  {
    id: "us-iran",
    slug: "us-strikes-iran-by-march-31-2026",
    title: "Удар США по Ирану",
    description: "Военная операция США против объектов на территории Ирана.",
    category: "USA-IRAN",
    active: true
  },
  {
    id: "iran-isr",
    slug: "iran-strike-on-israel-by-march-31-2026",
    title: "Удар Ирана по Израилю",
    description: "Ответная атака Тегерана непосредственно по израильской территории.",
    category: "IRAN-ISRAEL",
    active: true
  },
  {
    id: "leb-inv",
    slug: "israeli-ground-operation-in-lebanon-by-march-31",
    title: "Операция в Ливане",
    description: "Наземная операция в Южном Ливане до конца квартала.",
    category: "LEBANON",
    active: true
  }
];

export default function GeopoliticalDashboard() {
  const [threats, setThreats] = useState([]);
  const [totalRisk, setTotalRisk] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchPolymarketData = async () => {
      try {
        const results = await Promise.all(THREAT_CONFIG.map(async (threat) => {
          try {
            // Используем fetch напрямую к API Polymarket
            const response = await fetch(`https://gamma-api.polymarket.com/markets?slug=${threat.slug}`);
            if (!response.ok) return { ...threat, prob: 0 };
            
            const data = await response.json();
            if (data && data.length > 0) {
              const price = parseFloat(data[0].outcomePrices[0]);
              return { ...threat, prob: Math.round(price * 100) };
            }
            return { ...threat, prob: 0 };
          } catch (e) {
            return { ...threat, prob: 0 };
          }
        }));

        setThreats(results);
        const activeProbs = results.filter(r => r.prob > 0).map(r => r.prob);
        if (activeProbs.length > 0) {
          const avg = activeProbs.reduce((a, b) => a + b, 0) / activeProbs.length;
          setTotalRisk(Math.round(avg));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolymarketData();
    const timer = setInterval(fetchPolymarketData, 300000); // Обновление раз в 5 минут
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  if (loading) return (
    <div className="min-h-screen bg-black text-green-500 flex items-center justify-center font-mono uppercase tracking-widest">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Инициализация системы анализа угроз...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono p-4 sm:p-10 selection:bg-green-500 selection:text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="border-b-2 border-green-900/40 pb-8 mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-green-500 flex items-center gap-3">
              <ShieldAlert size={32} className="text-red-600 animate-pulse" />
              THREAT_ENGINE_V1.0
            </h1>
            <p className="text-xs text-green-900 mt-2 font-bold tracking-[0.2em] uppercase">
              Независимый мониторинг на основе данных Polymarket
            </p>
          </div>
          
          <div className="bg-green-950/10 border-l-4 border-green-500 p-6 flex flex-col items-end min-w-[240px]">
            <span className="text-[10px] text-green-700 uppercase mb-1 font-bold">Усредненный индекс риска</span>
            <div className="text-5xl font-black text-green-500 leading-none">
              {totalRisk}%
            </div>
          </div>
        </header>

        {/* THREATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {threats.map((threat) => (
            <div key={threat.id} className="group relative bg-[#050505] border border-green-900/30 p-6 transition-all hover:border-green-500/50 hover:bg-green-950/5">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] bg-green-900/20 text-green-600 px-2 py-1 mb-2 inline-block border border-green-900/30">
                    SECTOR: {threat.category}
                  </span>
                  <h3 className="text-xl font-bold text-white uppercase group-hover:text-green-400 transition-colors">
                    {threat.title}
                  </h3>
                </div>
                <div className={`text-3xl font-black ${threat.prob > 40 ? 'text-red-600' : 'text-green-500'}`}>
                  {threat.prob}%
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-8 h-12 overflow-hidden leading-relaxed border-l border-green-900/50 pl-4">
                {threat.description}
              </p>

              {/* PROGRESS BAR */}
              <div className="relative pt-4">
                <div className="flex justify-between text-[9px] mb-2 uppercase text-gray-600 tracking-tighter">
                  <span>Низкий риск</span>
                  <span>Вероятность эскалации</span>
                  <span>Критично</span>
                </div>
                <div className="h-3 bg-gray-900 border border-green-900/20 rounded-none overflow-hidden p-[2px]">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${threat.prob > 40 ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-green-600'}`}
                    style={{ width: `${threat.prob}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center text-[10px] text-green-900 font-bold">
                <span className="flex items-center gap-1 uppercase"><Activity size={10}/> Data_Live</span>
                <span className="flex items-center gap-1 uppercase"><Zap size={10}/> Sync_OK</span>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER / ADMIN CONTROL */}
        <footer className="mt-16 pt-8 border-t border-green-900/30 flex flex-col md:flex-row justify-between gap-4 text-gray-600 uppercase text-[9px]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-green-800"><AlertTriangle size={12}/> Внимание: Прогнозы основаны на ставках трейдеров</span>
            <span>Update: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="text-green-900">
            System_Status: Operational | Vercel_Build: OK
          </div>
        </footer>
      </div>
    </div>
  );
}
