import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { shareMetadata } from '@/lib/share-metadata';
import { SITE_URL } from '@/lib/site-url';
import './globals.css';

const inter = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2',
      weight: '400',
    },
    {
      path: '../../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2',
      weight: '500',
    },
    {
      path: '../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2',
      weight: '600',
    },
    {
      path: '../../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2',
      weight: '700',
    },
  ],
  variable: '--font-inter',
});

const editorial = localFont({
  src: '../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2',
  weight: '400',
  variable: '--font-editorial',
});

export const metadata: Metadata = {
  ...shareMetadata(
    'cueframe',
    'Editable motion clips, poster packs and websites. Change anything in the browser, then export or publish.',
  ),
  metadataBase: SITE_URL,
  appleWebApp: { title: 'cueframe', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

const themeBootstrap = `(function(){try{var t=localStorage.getItem('neuclip-theme');var d=t===null||t==='dark'||((t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');}}catch(e){}})();`;

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className={`${inter.variable} ${editorial.variable}`} suppressHydrationWarning>
    <head>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, inline theme bootstrap to avoid a flash of the wrong theme */}
      <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
    </head>
    <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <ThemeProvider>{children}</ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
