import React from 'react';

const faqs = [
  {
    q: 'How do I create a token?',
    a: 'Fill out the Create Your Token form, connect your wallet, and click Deploy Token. Your token will be deployed on Base instantly.'
  },
  {
    q: 'Is it safe to add liquidity to Uniswap?',
    a: 'Yes, but always double-check your contract address and token details before adding liquidity. Only add liquidity to tokens you control.'
  },
  // Removed verification-related FAQ as the app no longer supports verification
  {
    q: 'Can anyone create a token?',
    a: 'Yes! This platform is designed for anyone to create a Base token with no coding required.'
  },
  {
    q: 'Where can I find my deployed tokens?',
    a: 'Your recently deployed tokens appear in the Token History section below the form.'
  },
  {
    q: 'What are the fees?',
    a: 'A small deploy fee is required to prevent spam and cover network costs. The fee is shown before you deploy.'
  },
];

export default function FaqSection() {
  return (
    <section className="max-w-2xl mx-auto mt-10 mb-10 p-4 sm:p-8 rounded-3xl bg-white/40 border border-blue-300/30 shadow-xl backdrop-blur-2xl" aria-label="FAQ and help">
      <h3 className="text-lg sm:text-2xl font-extrabold mb-6 text-[#0000FF] text-center" id="faq-title">FAQ & Help</h3>
      <ul className="space-y-6" aria-labelledby="faq-title">
        {faqs.map((item, i) => (
          <li key={i} className="focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl p-2">
            <div className="font-bold text-blue-900 mb-1">Q: {item.q}</div>
            <div className="text-blue-700">A: {item.a}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
