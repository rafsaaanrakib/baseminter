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
  title: "baseminter.fun | No-Code ERC20 Token Creator on Base",
  description: "Mint, verify, and trade your own ERC20 token on Base instantly. No coding required. Premium, secure, and Base-branded.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "baseminter.fun | No-Code ERC20 Token Creator on Base",
    description: "Mint, verify, and trade your own ERC20 token on Base instantly. No coding required. Premium, secure, and Base-branded.",
    url: "https://baseminter.fun/",
    siteName: "baseminter.fun",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "baseminter.fun - No-Code ERC20 Token Creator on Base"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "baseminter.fun | No-Code ERC20 Token Creator on Base",
    description: "Mint, verify, and trade your own ERC20 token on Base instantly. No coding required. Premium, secure, and Base-branded.",
    site: "@base",
    creator: "@base",
    images: ["/og-image.png"]
  },
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
