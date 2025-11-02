// file: app/actions/emails/send-contact-email.ts

'use server';

import { Resend } from 'resend';
import { render } from '@react-email/render';
import { z } from 'zod';
import ContactFormNotificationEmail from '@/emails/ContactFormNotificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  service: z.string().nonempty(),
  message: z.string().min(10),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function sendContactEmail(data: ContactFormData) {
  const validated = contactSchema.safeParse(data);
  if (!validated.success) {
    throw new Error('Datos de contacto inválidos');
  }

  const { name, email, service, message } = validated.data;

  const html = await render(
    ContactFormNotificationEmail({
      name,
      email,
      service,
      message,
    }),
  );

  try {
    await resend.emails.send({
      from: 'Carlos Rojas <hello@carlosrojasj.dev>',
      to: ['carlosgrj@outlook.com'],
      subject: 'Nuevo mensaje desde el formulario de contacto',
      html,
    });
  } catch (error) {
    console.error('Error al enviar correo de contacto:', error);
    throw new Error('No se pudo enviar el correo de contacto');
  }
}
