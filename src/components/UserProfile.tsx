import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import type { TokenInfo } from './TokenHistory';

export default function UserProfile() {
  const { address, isConnected } = useAccount();
  const [tokens, setTokens] = useState<(TokenInfo & { deployer?: string })[]>([]);
  useEffect(() => {
    const load = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('deployedTokens') || '[]');
        setTokens(stored);
      } catch {
        setTokens([]);
      }
    };
    load();
    window.addEventListener('deployedTokensUpdated', load);
    return () => window.removeEventListener('deployedTokensUpdated', load);
  }, []);
  if (!isConnected || !address) return null;
  // Only show tokens with a valid contract address
  const userTokens = tokens.filter(t => t.deployer && t.deployer.toLowerCase() === address.toLowerCase() && t.address && t.address !== address);
  return (
    <section className="max-w-xl mx-auto mt-10 p-4 sm:p-6 rounded-2xl bg-white/40 border border-blue-300/30 shadow-lg backdrop-blur-md" aria-label="User profile">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#0000FF]" id="user-profile-title">Your Profile</h3>
      <div className="mb-2 text-blue-900 font-semibold">Wallet: <span className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span></div>
      <div className="mb-2 text-blue-900">Tokens Deployed: <span className="font-bold">{userTokens.length}</span></div>
    </section>
  );
}
