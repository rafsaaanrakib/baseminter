"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { syncDeployedTokens } from '@/utils/syncTokens';

type Token = {
  name: string;
  symbol: string;
  supply: string;
  address: string;
  views?: number;
  price?: string;
  holders?: number;
  liquidity?: string;
};
import TokenDetailsModal from '@/components/TokenDetailsModal';
import { fetchHoldersBasescan, fetchPriceUniswap, fetchLiquidityUniswap } from '@/utils/tokenStats';

export default function TokenGallery() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Token | null>(null);
  const [syncing, setSyncing] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    const updateTokens = async () => {
      const stored = localStorage.getItem('deployedTokens');
      const analytics = localStorage.getItem('tokenAnalytics');
      let tokens: Token[] = [];
      if (stored) tokens = JSON.parse(stored);
      if (analytics) {
        const views = JSON.parse(analytics);
        tokens = tokens.map(t => ({ ...t, views: views[t.address] || 0 }));
      }
      // Fetch live stats for each token
      const updatedTokens = await Promise.all(tokens.map(async t => {
        const holders = await fetchHoldersBasescan(t.address);
        const price = await fetchPriceUniswap(t.address);
        const liquidity = await fetchLiquidityUniswap(t.address);
        return {
          ...t,
          holders: holders === null ? undefined : holders,
          price: price === null ? undefined : price,
          liquidity: liquidity === null ? undefined : liquidity,
        };
      }));
      setTokens(updatedTokens);
    };
    updateTokens();
    
    // Auto-sync on mount if wallet is connected
    if (address) {
      syncDeployedTokens(address).catch(console.error);
    }
    
    window.addEventListener('deployedTokensUpdated', updateTokens);
    return () => window.removeEventListener('deployedTokensUpdated', updateTokens);
  }, [address]);

  const filtered = tokens.filter(
    (t: Token) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // Track view count when a token is selected
  const handleSelect = (token: Token) => {
    setSelected(token);
    const analytics = localStorage.getItem('tokenAnalytics');
    let views: Record<string, number> = analytics ? JSON.parse(analytics) : {};
    views[token.address] = (views[token.address] || 0) + 1;
    localStorage.setItem('tokenAnalytics', JSON.stringify(views));
    setTokens(tokens =>
      tokens.map(t =>
        t.address === token.address ? { ...t, views: (views[token.address] || 1) } : t
      )
    );
  };

  const handleSync = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }
    setSyncing(true);
    try {
      const count = await syncDeployedTokens(address);
      if (count && count > 0) {
        alert(`✅ Synced ${count} token(s) from blockchain!`);
      } else {
        alert('✅ All tokens already synced');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      alert('❌ Failed to sync tokens. Check console for details.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0000FF] via-blue-400 to-white flex flex-col items-center py-20 px-4">
      <h1 className="text-4xl font-extrabold text-[#0000FF] mb-8 text-center">Profile</h1>
      <button
        onClick={handleSync}
        disabled={syncing || !address}
        className="mb-6 px-6 py-3 text-base font-bold rounded-lg bg-blue-700 text-white hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Sync tokens from blockchain"
      >
        {syncing ? '🔄 Syncing...' : '🔄 Sync My Tokens'}
      </button>
  <div className="w-full max-w-6xl mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg mb-4"
          placeholder="Search by name or symbol..."
          aria-label="Search tokens"
        />
        {filtered.length === 0 ? (
          <div className="text-center text-blue-900 font-semibold py-8">No tokens found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((token, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(0,0,255,0.15)', filter: 'brightness(1.05)' }}
                  transition={{ duration: 0.3, type: 'spring' }}
                  className="p-4 rounded-2xl bg-white/60 border border-blue-300/30 shadow-lg hover:bg-blue-100/60 transition cursor-pointer flex flex-col"
                  tabIndex={0}
                  aria-label={`View details for ${token.name} (${token.symbol})`}
                  onClick={() => handleSelect(token)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { handleSelect(token); } }}
                >
                  <div className="font-semibold text-lg text-[#0000FF]">{token.name} <span className="text-blue-700">({token.symbol})</span></div>
                  <div className="text-sm text-blue-900">Supply: {token.supply}</div>
                  <div className="text-xs text-blue-700 mt-1">Views: {token.views ?? 0}</div>
                  <div className="text-xs text-blue-700 mt-1 flex gap-4">
                    <span>Price: {token.price ?? '--'}</span>
                    <span>Holders: {token.holders ?? '--'}</span>
                    <span>Liquidity: {token.liquidity ?? '--'}</span>
                  </div>
                  <div className="text-sm mt-1 flex flex-wrap gap-2 items-center">
                    <a
                      href={`https://basescan.org/address/${token.address}`}
                      target="_blank"
                      rel="noopener"
                      className="text-blue-600 underline mr-2"
                      aria-label={`View ${token.name} on Basescan`}
                      onClick={e => e.stopPropagation()}
                    >
                      Basescan
                    </a>
                    <a
                      href={`https://app.uniswap.org/explore/tokens/base/${token.address}`}
                      target="_blank"
                      rel="noopener"
                      className="text-blue-600 underline"
                      aria-label={`View ${token.name} on Uniswap`}
                      onClick={e => e.stopPropagation()}
                    >
                      Uniswap
                    </a>
                    <button
                      className="text-blue-600 underline flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-100"
                      aria-label="Share on X"
                      onClick={e => {
                        e.stopPropagation();
                        const tweet = encodeURIComponent(
                          `🚀 Just launched my new Base token!\n\nCheck it out 👇\nCA: ${token.address}\n\nBuilt instantly with⚡@BaseMinterFun\n#BaseMinter #Base #OnBase #BaseChain #DeFi #Crypto #Memecoin`
                        );
                        window.open(`https://twitter.com/intent/tweet?text=${tweet}`);
                      }}
                    >
                      <span aria-hidden="true">🐦</span> Share on X
                    </button>
                    {/* Facebook share removed per request */}
                    <button
                      className="text-blue-600 underline flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-100"
                      aria-label="Copy token link"
                      onClick={e => {
                        e.stopPropagation();
                        const url = `https://yourdapp.com/gallery?token=${token.address}`;
                        navigator.clipboard.writeText(url);
                      }}
                    >
                      <span aria-hidden="true">🔗</span> Copy Link
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
  <TokenDetailsModal token={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
