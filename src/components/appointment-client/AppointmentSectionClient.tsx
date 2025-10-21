'use client';

import { useState } from 'react';
import { AppointmentFormValues } from '@/validation/appointment';
import { AppointmentForm } from '../forms/AppointmentForm';

export function AppointmentSectionClient() {
  const [submittedAppointment, setSubmittedAppointment] =
    useState<AppointmentFormValues | null>(null);

  return (
    <>
      {!submittedAppointment && (
        <section className='mb-8 text-center'>
          <h1
            id='appointment-page-title'
            className='text-3xl font-bold tracking-tight text-primary'>
            Agendar una cita
          </h1>
          <p className='mt-2 text-muted-foreground'>
            Selecciona una fecha y hora disponible. Recibirás confirmación por
            correo electrónico.
          </p>
        </section>
      )}

      <section aria-label='Formulario para agendar una sesión'>
        <AppointmentForm onSuccess={setSubmittedAppointment} />
      </section>
    </>
  );
}
