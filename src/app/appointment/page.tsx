import { Metadata } from 'next';
import { AppointmentSectionClient } from '@/components/appointment-client/AppointmentSectionClient';

export const metadata: Metadata = {
  title: 'Agendar una cita | Tejiendo Historias',
  description:
    'Selecciona una fecha y hora para tu sesión con Andrea. Citas psicológicas con un enfoque cálido y profesional.',
};

export default function AppointmentPage() {
  return (
    <main
      className='min-h-[80vh] max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 mt-10'
      aria-labelledby='appointment-page-title'>
      <AppointmentSectionClient />
    </main>
  );
}
