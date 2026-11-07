import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Shell } from '@/components/layout/Shell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HXD Gaming 2.0 — Discover More. Play Better. Support Creators.',
  description:
    'A modern, ad-free gaming discovery and library platform supporting Rwandan and independent game creators. Check hardware compatibility and find your next experience.',
  keywords: ['game discovery', 'indie games', 'african game developers', 'rwandan games', 'pc compatibility checker', 'hxd gaming'],
  authors: [{ name: 'Haxdev / HXD' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hxd-gaming.vercel.app'),
  openGraph: {
    title: 'HXD Gaming 2.0',
    description: 'Discover games, hardware specs, and independent African creators.',
    url: 'https://hxd-gaming.vercel.app',
    siteName: 'HXD Gaming',
    images: [
      {
        url: '/images/home.png',
        width: 1200,
        height: 630,
        alt: 'HXD Gaming 2.0',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="min-h-screen bg-[#090909] text-[#f5f5f5] antialiased selection:bg-[#a855f7] selection:text-white">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}

