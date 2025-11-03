import ContactSection from '@/components/sections/ContactSection';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Blog | Tejiendo Historias',
  description:
    'Descubre artículos sobre salud mental, bienestar emocional y desarrollo personal. Consejos prácticos y reflexiones para acompañarte en tu camino de sanación.',
  keywords: [
    'blog psicología',
    'bienestar emocional',
    'terapia psicológica',
    'salud mental',
    'desarrollo personal',
    'psicoterapia CDMX',
    'Tejiendo Historias blog',
  ],
  openGraph: {
    title: 'Blog | Tejiendo Historias',
    description:
      'Lecturas que te acompañan en tu proceso de sanación emocional. Encuentra artículos sobre terapia, vínculos humanos y autoconocimiento, escritos con calidez y cercanía desde la mirada de Tejiendo Historias.',
    url: 'https://www.tejiendohistoriaas.com.mx//blog',
    siteName: 'Tejiendo Historias',
    images: [
      {
        url: '/images/og-home.webp',
        alt: 'Logo de Tejiendo Historias sobre fondo cálido',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Tejiendo Historias',
    description:
      'Lecturas que te acompañan en tu proceso de sanación emocional. Encuentra artículos sobre terapia, vínculos humanos y autoconocimiento, escritos con calidez y cercanía desde la mirada de Tejiendo Historias.',
    images: ['/images/og-home.webp'],
  },
  metadataBase: new URL('https://www.tejiendohistoriaas.com.mx/'),
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
  },
};

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      <ContactSection />
    </div>
  );
}
