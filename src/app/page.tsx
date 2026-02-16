'use client';
import React, { useEffect, useState } from 'react';
import { ShieldAlert, Activity, Zap, AlertTriangle, Globe } from 'lucide-react';

// Конфигурация рынков (slug берутся из актуальных данных Polymarket на февраль 2026)
const THREAT_CONFIG = [
  {
    id: "isr-iran",
    slug: "israel-strikes-iran-by-march-31-2026",
    title: "Удар Израиля по Ирану",
    description: "Вероятность прямой атаки ЦАХАЛ по территории Ирана до конца марта.",
    category: "ISRAEL-IRAN"
  },
  {
    id: "us-iran",
    slug: "us-strikes-iran-by-march-31-2026",
    title: "Удар США по Ирану",
    description: "Военная операция или киберудар США по объектам Ирана.",
    category: "USA-IRAN"
  },
  {
    id: "iran-isr",
    slug: "iran-strike-on-israel-by-march-31-2026",
    title: "Удар Ирана по Израилю",
    description: "Ответная атака Тегерана по израильской территории.",
    category: "IRAN-ISRAEL"
  },
  {
    id: "leb-inv",
    slug: "israeli-ground-operation-in-lebanon-by-march-31",
    title: "Операция в Ливане",
    description: "Наземная операция в Южном Ливане до конца квартала.",
    category: "LEBANON"
  }
];

export default function Page() {
  const [threats, setThreats] = useState([]);
  const [totalRisk, setTotalRisk] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPolymarketData = async () => {
    try {
      const results = await Promise.all(THREAT_CONFIG.map(async (threat) => {
        try {
          const response = await fetch(`https://gamma-api.polymarket.com/markets?slug=${threat.slug}`);
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

  useEffect(() => {
    fetchPolymarketData();
    const timer = setInterval(fetchPolymarketData, 300000); // Обновление раз в 5 минут
    return () => clearInterval(timer);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center font-mono uppercase tracking-[0.3em]">
      <div className="w-16 h-1 border-t-2 border-green-500 animate-pulse mb-4"></div>
      <span>_SYSTEM_INITIALIZING_</span>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-gray-400 font-mono p-4 md:p-12 selection:bg-green-500 selection:text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP BAR / NAVIGATION STYLE */}
        <div className="flex justify-between items-center text-[10px] text-green-900 mb-8 border-b border-green-900/20 pb-2">
          <div className="flex gap-4">
            <span>STATUS: OPERATIONAL</span>
            <span>LOC: CENTER_DISTRICT_IL</span>
          </div>
          <span>{new Date().toISOString()}</span>
        </div>

        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-green-500 flex items-center gap-3 tracking-tighter">
              <ShieldAlert className="text-red-600 animate-pulse" size={40} />
              THREAT_ENGINE
            </h1>
            <p className="text-xs text-green-800 font-bold uppercase tracking-[0.4em]">
              Geopolitical Prediction Markets Analysis
            </p>
          </div>
          
          <div className="bg-green-950/10 border-l-2 border-green-500 px-8 py-4 flex flex-col items-end">
            <span className="text-[10px] text-green-700 uppercase mb-2 font-bold tracking-widest">Global Risk Index</span>
            <div className="text-6xl font-black text-green-500 leading-none tracking-tighter">
              {totalRisk}%
            </div>
          </div>
        </header>

        {/* THREATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-green-900/20 border border-green-900/20">
          {threats.map((threat) => (
            <div key={threat.id} className="bg-black p-8 group transition-all hover:bg-green-950/5">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={12} className="text-green-800" />
                    <span className="text-[10px] text-green-700 uppercase tracking-widest font-bold">
                      Sector: {threat.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase group-hover:text-green-500 transition-colors">
                    {threat.title}
                  </h3>
                </div>
                <div className={`text-4xl font-black ${threat.prob > 45 ? 'text-red-600' : 'text-green-500'}`}>
                  {threat.prob}%
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-10 leading-relaxed border-l border-green-900/30 pl-6">
                {threat.description}
              </p>

              {/* PROGRESS BAR */}
              <div className="space-y-3">
                <div className="h-1 w-full bg-gray-950 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-in-out ${threat.prob > 45 ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-green-600'}`}
                    style={{ width: `${threat.prob}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] uppercase font-bold text-gray-700 tracking-widest pt-2">
                  <span>Stability</span>
                  <span>Probability_Vector</span>
                  <span>Critical</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <footer className="mt-20 pt-8 border-t border-green-900/20 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-gray-700 uppercase tracking-widest font-bold">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Activity size={14} className="text-green-500" /> System_Live
            </span>
            <span className="flex items-center gap-2">
              <Zap size={14} className="text-green-500" /> Sync_Ready
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-900" />
            <span>Monitor strictly for analytical purposes // 2026_UNIT</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
