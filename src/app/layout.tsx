import type { Metadata, Viewport } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { CursorProvider } from '@/context/CursorContext';
import { GlobalExperienceLayer } from '@/components/experience/GlobalExperienceLayer';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tafrishaala — Welcome to the Future. Learn to Build the Future.',
  description:
    'Tafrishaala is a futuristic technology education platform and creative engineering institute. Master AI systems, spatial computing, creative technology, and high-performance interactive development.',
  keywords: [
    'Tafrishaala',
    'Creative Technology',
    'AI Engineering',
    'Spatial Computing',
    'Interactive Web Development',
    'GSAP Next.js Three.js',
    'Tech Education',
  ],
  authors: [{ name: 'Tafrishaala Creative Tech Labs' }],
  openGraph: {
    title: 'Tafrishaala — Welcome to the Future. Learn to Build the Future.',
    description:
      'The website itself demonstrates what we teach. Enter the future of interactive technology education.',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="void"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased selection:bg-[var(--accent-primary)] selection:text-[var(--bg-primary)]">
        <ThemeProvider>
          <CursorProvider>
            <GlobalExperienceLayer>
              <Navbar />
              <main id="main-content" className="flex-1">
                {children}
              </main>
            </GlobalExperienceLayer>
          </CursorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
