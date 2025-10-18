import React, { useEffect, useState, useCallback, useMemo } from 'react';
import TokenDetailsModal from './TokenDetailsModal';
import { useAccount } from 'wagmi';
import { syncDeployedTokens } from '@/utils/syncTokens';

export type TokenInfo = {
  name: string;
  symbol: string;
  supply: string;
  address: string;
  price?: string;
  holders?: number;
  liquidity?: string;
};

export default function TokenHistory() {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [selected, setSelected] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { address } = useAccount();

  const updateTokens = useCallback(() => {
    const stored = localStorage.getItem('deployedTokens');
    if (stored) {
      try {
        setTokens(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse tokens:', e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    updateTokens();
    
    // Auto-sync on mount if wallet is connected (debounced)
    let syncTimeout: NodeJS.Timeout;
    if (address) {
      syncTimeout = setTimeout(() => {
        syncDeployedTokens(address).catch(console.error);
      }, 500);
    }
    
    window.addEventListener('deployedTokensUpdated', updateTokens);
    return () => {
      window.removeEventListener('deployedTokensUpdated', updateTokens);
      if (syncTimeout) clearTimeout(syncTimeout);
    };
  }, [address, updateTokens]);

  const handleSync = useCallback(async () => {
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
  }, [address]);

  // Memoize filtered and sorted tokens
  const displayedTokens = useMemo(() => {
    return tokens
      .filter(t => !address || (t as any).deployer?.toLowerCase() === address.toLowerCase())
      .sort((a: any, b: any) => Number((b as any).blockNumber || 0) - Number((a as any).blockNumber || 0))
      .slice(0, 3);
  }, [tokens, address]);

  return (
    <section
      className="max-w-xl mx-auto mt-10 p-4 sm:p-6 rounded-2xl bg-white/20 border border-blue-300/30 shadow-lg backdrop-blur-md"
      aria-label="Recently deployed tokens"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-[#0000FF]" id="token-history-title">Recently Deployed Tokens</h3>
        <button
          onClick={handleSync}
          disabled={syncing || !address}
          className="px-4 py-2 text-sm font-bold rounded-lg bg-blue-700 text-white hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Sync tokens from blockchain"
        >
          {syncing ? '🔄 Syncing...' : '🔄 Sync Tokens'}
        </button>
      </div>
      <div className="space-y-4" aria-labelledby="token-history-title">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex flex-col gap-2 animate-pulse">
                <div className="w-full h-12 bg-blue-100/60 rounded-xl mb-2" />
                <div className="h-4 bg-blue-100/40 rounded w-1/2" />
              </div>
            ))
          : !tokens.length
          ? (
              <div className="text-center py-8 text-blue-900">
                <p className="text-lg font-semibold mb-2">No tokens deployed yet</p>
                <p className="text-sm">Deploy your first token above to see it here!</p>
              </div>
            )
      : displayedTokens.map((token, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <button
                  type="button"
                  className="w-full text-left p-3 sm:p-4 rounded-xl bg-white/40 border border-blue-300/20 shadow hover:bg-blue-100/60 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label={`View details for ${token.name} (${token.symbol})`}
                  onClick={() => setSelected(token)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setSelected(token); } }}
                >
                  <div className="font-semibold text-base sm:text-lg text-[#0000FF]">{token.name} <span className="text-blue-700">({token.symbol})</span></div>
                  <div className="text-xs sm:text-sm text-blue-900">Supply: {token.supply}</div>
                </button>
                <div className="text-xs sm:text-sm mt-1 flex gap-2">
                  <a href={`https://basescan.org/address/${token.address}`} target="_blank" rel="noopener" className="text-blue-600 underline" aria-label={`View ${token.name} on Basescan`}>Basescan</a>
                  <a href={`https://app.uniswap.org/explore/tokens/base/${token.address}`} target="_blank" rel="noopener" className="text-blue-600 underline" aria-label={`View ${token.name} on Uniswap`}>Uniswap</a>
                </div>
              </div>
            ))}
      </div>
      <TokenDetailsModal token={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
