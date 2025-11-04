'use server';

import { Resend } from 'resend';
import { render } from '@react-email/render';
import { z } from 'zod';
import ContactFormNotificationEmail from '@/emails/ContactFormNotificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z
    .string()
    .regex(
      /^(?:\+52)?\s?(?:\d{2,3}[\s-]?\d{3}[\s-]?\d{4})$/,
      'Número de teléfono inválido. Debe ser un número válido (10 dígitos).',
    )
    .min(10, 'El teléfono es requerido')
    .max(15, 'Número demasiado largo'),
  service: z.string().nonempty(),
  message: z.string().min(10),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function sendContactEmail(data: ContactFormData) {
  const validated = contactSchema.safeParse(data);
  if (!validated.success) {
    throw new Error('Datos de contacto inválidos');
  }

  const { name, email, phone, service, message } = validated.data;

  const html = await render(
    ContactFormNotificationEmail({
      name,
      email,
      phone,
      service,
      message,
    }),
  );

  try {
    await resend.emails.send({
      from: 'Andrea Armenta García <andreaag@tejiendohistoriaas.com.mx>',
      to: [process.env.AUTH_EMAIL!],
      subject: 'Nuevo mensaje desde el formulario de contacto',
      html,
    });
  } catch (error) {
    console.error('Error al enviar correo de contacto:', error);
    throw new Error('No se pudo enviar el correo de contacto');
  }
}
