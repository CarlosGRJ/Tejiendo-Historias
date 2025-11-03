import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavbarPage from '@/components/navbar/navbar';
import { Toaster } from '@/components/ui/sonner';
import Footer05Page from '@/components/footer-05/footer-05';
import { AuthProvider } from '@/context/AuthProvider';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
});

export const metadata: Metadata = {
  title: 'Tejiendo Historias | Psicoterapia individual, pareja y talleres',
  description:
    'Tejiendo Historias ofrece psicoterapia individual, de pareja y talleres en Ciudad de México. Espacio terapéutico con enfoque humano y profesional.',
  keywords: [
    'psicoterapia individual',
    'terapia de pareja',
    'talleres emocionales',
    'psicóloga CDMX',
    'salud mental',
    'Tejiendo Historias',
    'terapia en línea',
    'Andrea Armenta',
    'Andrea Armenta García',
  ],
  openGraph: {
    title: 'Tejiendo Historias | Psicoterapia y acompañamiento emocional',
    description:
      'Acompañamiento psicológico individual, de pareja y grupal en CDMX. Tejiendo historias de sanación y bienestar emocional.',
    url: 'https://www.tejiendohistoriaas.com.mx',
    siteName: 'Tejiendo Historias',
    images: [
      {
        url: '/images/og-home.webp',
        alt: 'Tejiendo Historias - Espacio terapéutico en CDMX',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tejiendo Historias | Psicoterapia y acompañamiento emocional',
    description:
      'Acompañamiento psicológico individual, de pareja y grupal en CDMX. Tejiendo historias de sanación y bienestar emocional.',
    images: ['/images/og-home.webp'],
  },
  metadataBase: new URL('https://www.tejiendohistoriaas.com.mx'),
  creator: 'Carlos Gerardo Rojas Jaime - Web Developer',
  authors: [
    {
      name: 'Carlos Gerardo Rojas Jaime',
      url: 'https://www.carlosrojasj.dev',
    },
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    'google-site-verification': 'Z-XgZ-TNzw8EZZjTvl9g2okGBCAbXvHDzPO3j3YL6yk', // <-- Replace with real token once you verify it in Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body className={`${inter.className} antialiased relative`}>
        <AuthProvider>
          <NavbarPage />
          <main>{children}</main>
        </AuthProvider>
        <Toaster richColors />
        <Analytics />
        <SpeedInsights />
        <Footer05Page />
      </body>
    </html>
  );
}
