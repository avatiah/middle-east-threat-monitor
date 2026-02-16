'use client';
import React, { useEffect, useState } from 'react';
import { ShieldAlert, Activity, Zap, AlertTriangle, Globe } from 'lucide-react';

const THREAT_CONFIG = [
  { id: "isr-iran", slug: "israel-strikes-iran-by-march-31-2026", title: "Удар Израиля по Ирану", category: "ISRAEL-IRAN", desc: "Вероятность атаки ЦАХАЛ по Ирану до конца марта." },
  { id: "us-iran", slug: "us-strikes-iran-by-march-31-2026", title: "Удар США по Ирану", category: "USA-IRAN", desc: "Военная операция США против объектов в Иране." },
  { id: "iran-isr", slug: "iran-strike-on-israel-by-march-31-2026", title: "Удар Ирана по Израилю", category: "IRAN-ISRAEL", desc: "Ответная атака Тегерана по территории Израиля." },
  { id: "leb-inv", slug: "israeli-ground-operation-in-lebanon-by-march-31", title: "Операция в Ливане", category: "LEBANON", desc: "Наземная операция в Южном Ливане в этом квартале." }
];

export default function Page() {
  const [threats, setThreats] = useState([]);
  const [totalRisk, setTotalRisk] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPolymarketData = async () => {
    try {
      const results = await Promise.all(THREAT_CONFIG.map(async (threat) => {
        try {
          // Используем прокси для обхода блокировок (CORS)
          const response = await fetch(`https://corsproxy.io/?https://gamma-api.polymarket.com/markets?slug=${threat.slug}`);
          const data = await response.json();
          if (data && data.length > 0) {
            const price = parseFloat(data[0].outcomePrices[0]);
            return { ...threat, prob: Math.round(price * 100) };
          }
        } catch (e) { console.error(e); }
        return { ...threat, prob: 0 };
      }));

      setThreats(results);
      const activeProbs = results.filter(r => r.prob > 0).map(r => r.prob);
      setTotalRisk(activeProbs.length > 0 ? Math.round(activeProbs.reduce((a, b) => a + b, 0) / activeProbs.length) : 0);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchPolymarketData();
    const timer = setInterval(fetchPolymarketData, 300000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-green-500 flex items-center justify-center font-mono animate-pulse">_INITIALIZING_THREAT_DATABASE...</div>;

  return (
    <main className="min-h-screen bg-black text-gray-400 font-mono p-6 md:p-12">
      <div className="max-w-5xl mx-auto border border-green-900/30 p-4 md:p-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-green-900/30 pb-8">
          <div>
            <h1 className="text-3xl font-black text-green-500 flex items-center gap-2 tracking-tighter">
              <ShieldAlert className="text-red-600 animate-pulse" /> THREAT_ENGINE_V1.0
            </h1>
            <p className="text-[10px] text-green-800 font-bold uppercase tracking-[0.3em] mt-2">Active Geopolitical Vectors // 2026</p>
          </div>
          <div className="bg-green-950/20 border-l-2 border-green-500 px-6 py-2">
            <span className="text-[10px] text-green-700 uppercase block font-bold">Total Risk Index</span>
            <span className="text-5xl font-black text-green-500 tracking-tighter">{totalRisk}%</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {threats.map((threat) => (
            <div key={threat.id} className="border border-green-900/20 p-6 bg-[#050505] hover:bg-green-950/5 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] text-green-800 border border-green-900/30 px-2 uppercase font-bold tracking-widest">{threat.category}</span>
                <span className={`text-3xl font-black ${threat.prob > 40 ? 'text-red-600' : 'text-green-500'}`}>{threat.prob}%</span>
              </div>
              <h3 className="text-white font-bold uppercase mb-2 tracking-tight">{threat.title}</h3>
              <p className="text-[11px] text-gray-600 mb-6 leading-relaxed">{threat.desc}</p>
              
              <div className="h-1 bg-gray-900 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${threat.prob > 40 ? 'bg-red-600 shadow-[0_0_8px_rgba(255,0,0,0.5)]' : 'bg-green-600'}`}
                  style={{ width: `${threat.prob}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-12 flex justify-between text-[9px] text-gray-700 uppercase tracking-widest font-bold border-t border-green-900/10 pt-4">
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-green-900"><Activity size={10} /> Live_Feed</span>
            <span className="flex items-center gap-1 text-green-900"><Zap size={10} /> Sync_Status_OK</span>
          </div>
          <span className="text-red-900/50 italic underline">Confidential // Monitoring_Only</span>
        </footer>
      </div>
    </main>
  );
}
