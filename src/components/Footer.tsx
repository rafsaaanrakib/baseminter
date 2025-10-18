import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-6 sm:py-8 bg-gradient-to-r from-[#0000FF] to-blue-400 text-white text-center mt-10 sm:mt-20 border-t border-blue-300/30" role="contentinfo" aria-label="Footer">
      <div className="mb-2 font-bold text-base sm:text-lg">BaseMinter</div>
      <div className="mb-2">&copy; {new Date().getFullYear()} BaseMinter. All rights reserved.</div>
      <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-2" aria-label="Footer links">
        <a href="https://basescan.org/" target="_blank" rel="noopener" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="Basescan">Basescan</a>
        <a href="https://app.uniswap.org/" target="_blank" rel="noopener" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="Uniswap">Uniswap</a>
  <a href="https://x.com/baseminterfun" target="_blank" rel="noopener" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="BaseMinter X">X</a>
  <a href="https://t.me/baseminterdotfun" target="_blank" rel="noopener" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="BaseMinter Telegram">Telegram</a>
        <a href="https://docs.base.org/" target="_blank" rel="noopener" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="Docs">Docs</a>
      </nav>
    </footer>
  );
}
