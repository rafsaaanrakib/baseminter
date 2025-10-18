import React, { useEffect, useState } from 'react';
import type { TokenInfo } from './TokenHistory';

function getStats(tokens: TokenInfo[]) {
  const total = tokens.length;
  const symbolCount: Record<string, number> = {};
  const nameCount: Record<string, number> = {};
  tokens.forEach(t => {
    symbolCount[t.symbol] = (symbolCount[t.symbol] || 0) + 1;
    nameCount[t.name] = (nameCount[t.name] || 0) + 1;
  });
  const mostPopularSymbol = Object.entries(symbolCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
  const mostPopularName = Object.entries(nameCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
  const recent = tokens.slice(0, 3);
  return { total, mostPopularSymbol, mostPopularName, recent };
}

export default function TokenStats() {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const update = () => {
      setLoading(true);
      setTimeout(() => {
        const stored = localStorage.getItem('deployedTokens');
        if (stored) setTokens(JSON.parse(stored));
        setLoading(false);
      }, 200);
    };
    update();
    window.addEventListener('deployedTokensUpdated', update);
    return () => window.removeEventListener('deployedTokensUpdated', update);
  }, []);
  const stats = getStats(tokens);
  return (
    <section className="max-w-xl mx-auto mt-10 p-4 sm:p-6 rounded-2xl bg-white/30 border border-blue-300/30 shadow-lg backdrop-blur-md" aria-label="Token analytics">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#0000FF]" id="token-analytics-title">Token Analytics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/60 rounded-xl p-4 text-center animate-pulse">
              <div className="h-8 sm:h-10 bg-blue-200/60 rounded mb-2" />
              <div className="h-4 bg-blue-100/60 rounded" />
            </div>
          ))
        ) : (
          <>
            <div className="bg-white/60 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0000FF]">{stats.total}</div>
              <div className="text-xs sm:text-sm text-blue-900">Total Tokens</div>
            </div>
            <div className="bg-white/60 rounded-xl p-4 text-center">
              <div className="text-lg sm:text-xl font-bold text-blue-700">{stats.mostPopularSymbol}</div>
              <div className="text-xs sm:text-sm text-blue-900">Most Popular Symbol</div>
            </div>
            <div className="bg-white/60 rounded-xl p-4 text-center">
              <div className="text-lg sm:text-xl font-bold text-blue-700">{stats.mostPopularName}</div>
              <div className="text-xs sm:text-sm text-blue-900">Most Popular Name</div>
            </div>
          </>
        )}
      </div>
      <div>
        <div className="text-blue-900 font-semibold mb-2">Recent Activity:</div>
        <ul className="text-blue-900 text-xs sm:text-sm space-y-1" aria-labelledby="token-analytics-title">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="h-6 bg-blue-100/60 rounded animate-pulse" />
              ))
            : stats.recent.map((t, i) => (
                <li key={i}>
                  <span className="font-semibold">{t.name} ({t.symbol})</span> - <span className="font-mono">{t.address.slice(0, 6)}...{t.address.slice(-4)}</span>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
