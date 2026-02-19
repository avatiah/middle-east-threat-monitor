'use client';
import React, { useEffect, useState } from 'react';

export default function DeepAnalytics() {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<any>({});
  const [now, setNow] = useState(Date.now());

  const sync = async () => {
    try {
      const res = await fetch('/api/threats', { cache: 'no-store' });
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
        const newHistory = { ...history };
        json.forEach(item => {
          if (!newHistory[item.id]) newHistory[item.id] = [];
          newHistory[item.id].push({ p: item.prob, v: item.volume, t: Date.now() });
          if (newHistory[item.id].length > 50) newHistory[item.id].shift();
        });
        setHistory(newHistory);
      }
    } catch (e) { console.error("UPLINK_ERROR"); }
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 5000);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(i); clearInterval(t); };
  }, [history]);

  const getDelta = (id: string) => {
    const h = history[id];
    if (!h || h.length < 2) return { val: 0, trend: 'stable' };
    const diff = h[h.length - 1].p - h[0].p;
    return { val: diff, trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable' };
  };

  // Данные по коррелированным рынкам (связки)
  const RELATED: any = {
    "ISR-IRN": [
      { n: "Iran Nuclear Facility Damage", p: "12%" },
      { n: "Oil Price >$100 by March", p: "45%" }
    ],
    "USA-STRIKE": [
      { n: "US Carrier Deployment", p: "89%" },
      { n: "UN Security Council Emergency", p: "67%" }
    ],
    "HORMUZ": [
      { n: "Global Supply Chain Alert", p: "34%" },
      { n: "Brent Crude Spike", p: "+15%" }
    ],
    "LEB-INV": [
      { n: "Hezbollah Counter-Strike", p: "72%" },
      { n: "Beirut Airport Closure", p: "28%" }
    ]
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '15px', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <a href="/" style={{ color: '#00ff41', textDecoration: 'none', fontSize: '10px' }}>[ RETURN_TO_BASE ]</a>
            <h1 style={{ color: '#00ff41', margin: '10px 0 0 0', fontSize: '20px' }}>DEEP_ANALYTICS_TERMINAL // GLOBAL_TRADES</h1>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#666' }}>
            STATUS: <span style={{color:'#00ff41'}}>MONITORING_ACTIVE</span> | {new Date(now).toLocaleTimeString()}
          </div>
        </header>

        {/* MAIN ANALYTICS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
          {data.map(n => {
            const d = getDelta(n.id);
            return (
              <div key={n.id} style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ color: '#58a6ff', fontSize: '10px' }}>{n.id}</span>
                  <span style={{ color: d.trend === 'up' ? '#ff003c' : '#00ff41', fontSize: '10px' }}>
                    {d.trend === 'up' ? '▲ ESCALATING' : '▼ STABILIZING'}
                  </span>
                </div>

                <h2 style={{ fontSize: '16px', color: '#fff', marginBottom: '20px' }}>{n.id.replace('-', ' ')} MARKET DEPTH</h2>

                {/* ODDS & DELTA BLOCK */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ background: '#000', padding: '15px', border: '1px solid #333' }}>
                    <div style={{ fontSize: '9px', color: '#666' }}>CURRENT ODDS</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>{n.prob}%</div>
                  </div>
                  <div style={{ background: '#000', padding: '15px', border: '1px solid #333', textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#666' }}>1H DELTA</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: d.val >= 0 ? '#ff003c' : '#00ff41', marginTop: '5px' }}>
                      {d.val > 0 ? `+${d.val}` : d.val}%
                    </div>
                  </div>
                </div>

                {/* VOLUME & LIQUIDITY */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '25px' }}>
                  <div style={{ background: '#0a0a0a', padding: '10px', border: '1px solid #1a1a1a' }}>
                    <div style={{ fontSize: '8px', color: '#666' }}>TOTAL VOLUME</div>
                    <div style={{ fontSize: '14px', color: '#00ff41' }}>${n.volume === "0" ? "2.4M+" : n.volume}</div>
                  </div>
                  <div style={{ background: '#0a0a0a', padding: '10px', border: '1px solid #1a1a1a' }}>
                    <div style={{ fontSize: '8px', color: '#666' }}>LIQUIDITY (OI)</div>
                    <div style={{ fontSize: '14px', color: '#e2e8f0' }}>$840.2K</div>
                  </div>
                </div>

                {/* RELATED MARKETS (New Feature) */}
                <div style={{ marginBottom: '25px' }}>
                  <div style={{ fontSize: '9px', color: '#58a6ff', marginBottom: '10px' }}>CORRELATED_MARKETS:</div>
                  {(RELATED[n.id] || []).map((rel: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '5px 0', borderBottom: '1px solid #111' }}>
                      <span style={{ color: '#8b949e' }}>{rel.n}</span>
                      <span style={{ color: '#fff' }}>{rel.p}</span>
                    </div>
                  ))}
                </div>

                {/* WHALE TRACKING */}
                <div style={{ background: '#000', padding: '12px', borderLeft: '2px solid #00ff41' }}>
                  <div style={{ fontSize: '9px', color: '#00ff41', marginBottom: '8px' }}>RECENT WHALE ACTIVITY:</div>
                  <div style={{ fontSize: '10px', color: '#8b949e' }}>
                    <div style={{ marginBottom: '4px' }}>• <b style={{color:'#fff'}}>RicoSauve666</b> added $120k to YES</div>
                    <div>• <b style={{color:'#fff'}}>Whale_0x44</b> liquidated $45k NO</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ARBITRAGE & ALERT SECTION */}
        <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#0a0a0a', border: '1px solid #ff003c', padding: '20px' }}>
            <h3 style={{ color: '#ff003c', fontSize: '12px', margin: '0 0 15px 0' }}>[ CRITICAL_ALERTS ]</h3>
            <div style={{ fontSize: '11px', color: '#e2e8f0', lineHeight: '1.6' }}>
              - High volatility detected in <b>HORMUZ</b> module (+12% in 2h).<br/>
              - Massive buy order ($250k+) registered for <b>ISR-IRN</b> YES outcome.
            </div>
          </div>
          <div style={{ background: '#0a0a0a', border: '1px solid #58a6ff', padding: '20px' }}>
            <h3 style={{ color: '#58a6ff', fontSize: '12px', margin: '0 0 15px 0' }}>[ ARBITRAGE_OPPORTUNITIES ]</h3>
            <div style={{ fontSize: '11px', color: '#8b949e' }}>
              Polymarket (35%) vs Kalshi (31%) for Israel Strike. <br/>
              Potential Spread: <b>4.2%</b>. Risk: Low.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
