import React from 'react';

const tips = [
  'Never share your private key or seed phrase with anyone.',
  'Add liquidity only to tokens you control and trust.',
  'Double-check token details (name, symbol, supply) before deploying.',
  'Beware of scams: only use official Base and Uniswap links.',
  'If unsure, ask for help in the official Base or Uniswap communities.'
];

export default function SecurityTips() {
  return (
    <section className="max-w-2xl mx-auto mt-10 mb-10 p-4 sm:p-8 rounded-3xl bg-white/40 border border-blue-300/30 shadow-xl backdrop-blur-2xl" aria-label="Security tips">
      <h3 className="text-lg sm:text-2xl font-extrabold mb-6 text-[#0000FF] text-center" id="security-tips-title">Security Tips</h3>
      <ul className="space-y-4 list-disc list-inside" aria-labelledby="security-tips-title">
        {tips.map((tip, i) => (
          <li key={i} className="text-blue-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl p-2">{tip}</li>
        ))}
      </ul>
    </section>
  );
}
