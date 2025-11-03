import { Metadata } from 'next';

import AboutMeHeroSection from '@/components/sections/AboutMeHeroSection';
import AboutMeSection from '@/components/sections/AboutMeSection';
import ConferencesSection from '@/components/sections/conferencesSection';
import ContactSection from '@/components/sections/ContactSection';
import ExperienceSection from '@/components/sections/ExperienceSection';

export const metadata: Metadata = {
  title: 'Sobre mí | Tejiendo Historias',
  description:
    'Conoce a Andrea, psicóloga comprometida con tu bienestar emocional. Descubre su formación, experiencia clínica y enfoque humano en Tejiendo Historias.',
  openGraph: {
    title: 'Sobre mí | Tejiendo Historias',
    description:
      'Conoce a Andrea, psicóloga comprometida con tu bienestar emocional. Descubre su formación, experiencia clínica y enfoque humano en Tejiendo Historias.',
    url: 'https://www.tejiendohistoriaas.com.mx/about-me',
    siteName: 'Tejiendo Historias',
    images: [
      {
        url: '/images/avatar.webp',
        alt: 'Andrea - Psicóloga de Tejiendo Historias',
      },
    ],
    locale: 'es_MX',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre mí | Tejiendo Historias',
    description:
      'Conoce a Andrea, psicóloga comprometida con tu bienestar emocional. Descubre su formación y enfoque humano.',
    images: ['/images/og-about.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutMe() {
  return (
    <>
      <AboutMeHeroSection />
      <AboutMeSection />

      <ExperienceSection />

      <ConferencesSection />

      <ContactSection />
    </>
  );
}
