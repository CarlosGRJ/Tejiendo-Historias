import { SERVICES, TIME_SLOTS } from '@/constants';
import { z } from 'zod';

export const appointmentSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido' }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
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
