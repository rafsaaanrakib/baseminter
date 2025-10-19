import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./motion-fade.css";
import { Web3Provider } from '@/providers/Web3Provider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://baseminter.fun"),
  title: "baseminter.fun | No-Code ERC20 Token Creator on Base",
  description:
    "Mint, verify, and trade your own ERC20 token on Base instantly. No coding required. Premium, secure, and Base-branded.",
  applicationName: "Base Minter",
  keywords: [
    "Base",
    "Base Chain",
    "ERC20",
    "token generator",
    "no code",
    "mint token",
    "deploy token",
    "crypto",
    "DeFi",
  ],
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "Pj3T7yR6E3oaLCzz8FWZu-x27YDKrUoGUGZTtAhxSWo",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml", rel: "icon" }],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: "baseminter.fun | No-Code ERC20 Token Creator on Base",
    description:
      "Mint, verify, and trade your own ERC20 token on Base instantly. No coding required. Premium, secure, and Base-branded.",
    url: "https://baseminter.fun/",
    siteName: "baseminter.fun",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "baseminter.fun - No-Code ERC20 Token Creator on Base",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "baseminter.fun | No-Code ERC20 Token Creator on Base",
    description:
      "Mint, verify, and trade your own ERC20 token on Base instantly. No coding required. Premium, secure, and Base-branded.",
    site: "@base",
    creator: "@base",
    images: ["/og-image.png"],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // AnimatePresence for page transitions
  // Use motion.div for fade-in/out effect
  // 'children' is the page content
  // 'key' is set to location for correct animation
  // This requires framer-motion

  return (
    <html lang="en">
      <head>
        {/* Canonical (redundant with alternates.canonical but ensures link tag) */}
        <link rel="canonical" href="https://baseminter.fun/" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1D0MTCLX5K"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1D0MTCLX5K');
            `,
          }}
        />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'baseminter.fun',
              url: 'https://baseminter.fun/',
              description:
                'Mint, verify, and trade your own ERC20 token on Base instantly. No coding required.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://baseminter.fun/gallery?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Base Minter',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Provider>
          {/* AnimatePresence for page transitions */}
          <div id="__page-transition-wrapper">
            {/* @ts-ignore - framer-motion is client-side only */}
            <div suppressHydrationWarning>
              {/* Use motion.div for fade-in/out */}
              {/* You may need to wrap this in AnimatePresence in _app.tsx for multi-page apps */}
              <div className="motion-fade">
                {children}
              </div>
            </div>
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
