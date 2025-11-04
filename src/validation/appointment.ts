import { SERVICES, TIME_SLOTS } from '@/constants';
import { z } from 'zod';

export const appointmentSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido' }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  phone: z
    .string()
    .regex(
      /^(?:\+52)?\s?(?:\d{2,3}[\s-]?\d{3}[\s-]?\d{4})$/,
      'Número de teléfono inválido. Debe ser un número válido (10 dígitos).',
    )
    .min(10, 'El teléfono es requerido')
    .max(15, 'Número demasiado largo'),
  date: z.date({ required_error: 'Selecciona una fecha válida' }),
  time: z
    .union([
      z.string().nonempty('Selecciona un horario válido'),
      z.enum(TIME_SLOTS),
    ])
    .refine((val) => val !== '', {
      message: 'Selecciona un horario válido',
    }),
  service: z
    .string()
    .min(1, { message: 'Selecciona un servicio' })
    .refine((val) => SERVICES.some((s) => s.title === val), {
      message: 'Servicio no válido',
    }),
  message: z.string().optional(),
  turnstileToken: z
    .string()
    .min(1, 'Por favor, completa el captcha antes de enviar.'),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
