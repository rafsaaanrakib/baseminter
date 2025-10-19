import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | baseminter.fun',
  description:
    'View your deployed Base tokens, stats, holders, and liquidity. Sync tokens from blockchain and share easily.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Profile | baseminter.fun',
    description:
      'Track and share your Base tokens. Holders, price, and liquidity at a glance.',
    url: 'https://baseminter.fun/gallery',
  images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profile | baseminter.fun',
    description:
      'Track and share your Base tokens. Holders, price, and liquidity at a glance.',
    images: ['/og-image.png'],
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
