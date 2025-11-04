'use server';

import { Resend } from 'resend';
import { AppointmentFormValues } from '@/validation/appointment';
import { render } from '@react-email/render';

import AppointmentConfirmation from '@/emails/AppointmentConfirmation';
import NewAppointmentNotification from '@/emails/NewAppointmentNotification';
import { format } from 'date-fns';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(
  data: AppointmentFormValues,
  calendarUrl: string,
  icsContent: string,
) {
  const icsBuffer = Buffer.from(icsContent);
  const formattedDate = format(data.date, 'PPP');

  try {
    // HTML para el paciente
    const confirmationHtml = await render(
      AppointmentConfirmation({
        name: data.name,
        date: formattedDate,
        time: data.time,
        service: data.service,
      }),
    );

    // HTML para Admin
    const notificationHtml = await render(
      NewAppointmentNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: formattedDate,
        time: data.time,
        service: data.service,
        message: data.message ?? '',
        calendarUrl,
      }),
    );

    await resend.emails.send({
      //   from: 'Tejiendo Historias <no-reply@tejiendohistorias.com>',
      //   to: data.email,
      // TODO: ADD REAL EMAILS
      from: 'Andrea Armenta García <andreaag@tejiendohistoriaas.com.mx>',
      to: ['carlosgrjpruebas@gmail.com'],
      subject: 'Tu cita ha sido agendada – Tejiendo Historias',
      html: confirmationHtml,
    });

    await resend.emails.send({
      //   from: 'Tejiendo Historias <no-reply@tejiendohistorias.com>',
      //   to: process.env.AUTH_EMAIL!,
      // TODO: ADD REAL EMAILS
      from: 'Andrea Armenta García <andreaag@tejiendohistoriaas.com.mx>',
      to: ['carlosgrj2013@gmail.com'],
      subject: 'Nueva cita agendada',
      html: notificationHtml,
      attachments: [
        {
          filename: 'cita.ics',
          content: icsBuffer.toString('base64'),
        },
      ],
    });
  } catch (error) {
    console.error('Error al enviar correos:', error);
    throw new Error('No se pudieron enviar los correos');
  }
}
