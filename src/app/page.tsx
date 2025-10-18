'use client';

import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import TokenForm from '@/components/TokenForm';
import TokenHistory from '@/components/TokenHistory';

// Lazy load components that are below the fold
const TokenStats = dynamic(() => import('@/components/TokenStats'), {
  loading: () => <div className="h-32 animate-pulse bg-white/20 rounded-2xl" />,
});

const UserProfile = dynamic(() => import('@/components/UserProfile'), {
  loading: () => <div className="h-24 animate-pulse bg-white/20 rounded-2xl" />,
});

const FaqSection = dynamic(() => import('@/components/FaqSection'), {
  loading: () => <div className="h-48 animate-pulse bg-white/20 rounded-2xl" />,
});

const SecurityTips = dynamic(() => import('@/components/SecurityTips'), {
  loading: () => <div className="h-48 animate-pulse bg-white/20 rounded-2xl" />,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32" />,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0000FF] via-blue-400 to-white flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <section className="py-20 px-4 flex-1">
        <UserProfile />
        <TokenStats />
        <TokenForm />
        <div className="mt-8">
          {/* Show token deployment history below the form */}
          <TokenHistory />
        </div>
        <FaqSection />
        <SecurityTips />

      </section>
      <Footer />
    </main>
  );
}