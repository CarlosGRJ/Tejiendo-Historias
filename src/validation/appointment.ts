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
    .union([z.string().nonempty('Selecciona un servicio'), z.enum(SERVICES)])
    .refine((val) => val !== '', {
      message: 'Selecciona un servicio',
    }),
  message: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
