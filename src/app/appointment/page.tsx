import { Metadata } from 'next';
import { AppointmentSectionClient } from '@/components/appointment-client/AppointmentSectionClient';

export const metadata: Metadata = {
  title: 'Agenda tu cita de psicoterapia | Tejiendo Historias',
  description:
    'Reserva tu cita con Andrea, psicoterapeuta con enfoque cálido y humano. Escoge el día y la hora que mejor se adapte a ti.',
  keywords: [
    'agendar cita psicológica',
    'terapia emocional',
    'psicoterapia CDMX',
    'consultas psicológicas online',
    'terapia individual',
    'Tejiendo Historias',
    'Andrea Armenta',
    'Andrea Armenta García',
  ],
  openGraph: {
    title: 'Agenda tu cita | Tejiendo Historias',
    description:
      'Selecciona una fecha y hora para agendar tu cita con Andrea. Atención profesional y cercana.',
    url: 'https://www.tejiendohistoriaas.com.mx/appointment',
      siteName: 'Tejiendo Historias',
      locale: 'es_MX',
    type: 'website',
    images: [
      {
        url: '/images/og-home.webp',
        alt: 'Agenda tu cita con Andrea – Tejiendo Historias',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agenda tu cita con Andrea | Tejiendo Historias',
    description:
      'Atención psicológica para tu bienestar emocional. Elige día y hora para tu sesión con Andrea.',
    images: ['/images/og-home.webp'],
  },
  metadataBase: new URL('https://www.tejiendohistoriaas.com.mx'),
  robots: {
    index: true,
    follow: true,
  },
};

export default function AppointmentPage() {
  return (
    <main
      className='min-h-[80vh] max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 mt-10'
      aria-labelledby='appointment-page-title'>
      <AppointmentSectionClient />
    </main>
  );
}
