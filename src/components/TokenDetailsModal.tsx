import React from 'react';
import type { TokenInfo } from './TokenHistory';

interface TokenDetailsModalProps {
  token: TokenInfo | null;
  onClose: () => void;
}

export default function TokenDetailsModal({ token, onClose }: TokenDetailsModalProps) {
  if (!token) return null;
  const shareText = encodeURIComponent(
    `🚀 Just launched my new Base token!\n\nCheck it out 👇\nCA: ${token.address}\n\nBuilt instantly with⚡@BaseMinterFun\n#BaseMinter #Base #OnBase #BaseChain #DeFi #Crypto #Memecoin`
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="token-details-title"
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-md w-full relative border-2 border-blue-200 flex flex-col" tabIndex={0}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-700 hover:text-[#0000FF] text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 btn-modal-close"
          aria-label="Close token details"
        >
          ×
        </button>
        <h2 className="text-xl sm:text-2xl font-extrabold mb-4 text-[#0000FF]" id="token-details-title">Token Details</h2>
        <div className="mb-2 text-base sm:text-lg font-semibold text-blue-900">{token.name} <span className="text-blue-700">({token.symbol})</span></div>
        <div className="mb-2 text-sm sm:text-base text-blue-900">Supply: {token.supply}</div>
        <div className="mb-2 text-sm sm:text-base text-blue-900 break-all">Address: <span className="font-mono">{token.address}</span></div>
        <div className="mb-2 text-sm sm:text-base text-blue-900 flex gap-4">
          <span>Price: {token.price ?? '--'}</span>
          <span>Holders: {token.holders ?? '--'}</span>
          <span>Liquidity: {token.liquidity ?? '--'}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
          <a href={`https://basescan.org/address/${token.address}`} target="_blank" rel="noopener" className="text-white bg-[#0000FF] px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="View on Basescan">Basescan</a>
          <a href={`https://app.uniswap.org/explore/tokens/base/${token.address}`} target="_blank" rel="noopener" className="text-white bg-blue-400 px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="View on Uniswap">Uniswap</a>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6 justify-center">
          <a href={twitterUrl} target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg font-bold hover:bg-[#0d8ddb] transition focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Share on X">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.72 0-4.924 2.206-4.924 4.924 0 .386.044.762.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.724-.666 1.562-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg>
            Share on X
          </a>
          {/* Discord share removed per request */}
        </div>
      </div>
    </div>
  );
}
