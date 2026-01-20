import { z } from 'zod';
import { SERVICES, TIME_SLOTS } from '@/constants';
import { RECURRENCE_DAY_VALUES, RecurrenceDay } from '@/types/appointment';

const adminAppointmentBaseSchema = z.object({
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

const validateSingleAppointment = (
  data: AdminAppointmentFormValues,
  ctx: z.RefinementCtx,
) => {
  if (!data.date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Selecciona una fecha válida',
      path: ['date'],
    });
  }

  if (!data.time) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Selecciona un horario válido',
      path: ['time'],
    });
  }

  if (
    data.time &&
    !TIME_SLOTS.includes(data.time as (typeof TIME_SLOTS)[number])
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Horario no válido',
      path: ['time'],
    });
  }
};

const validateRecurringAppointment = (
  data: AdminAppointmentFormValues,
  ctx: z.RefinementCtx,
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!data.recurrenceStartDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Selecciona una fecha de inicio',
      path: ['recurrenceStartDate'],
    });
  }

  if (data.recurrenceStartDate && data.recurrenceStartDate < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'La fecha de inicio no puede ser anterior a hoy',
      path: ['recurrenceStartDate'],
    });
  }

  if (data.recurrenceEndDate && data.recurrenceStartDate) {
    if (data.recurrenceEndDate < data.recurrenceStartDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La fecha de fin debe ser posterior a la de inicio',
        path: ['recurrenceEndDate'],
      });
    }
  }

  if (!data.recurrenceDays || data.recurrenceDays.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Selecciona al menos un día',
      path: ['recurrenceDays'],
    });
  }

  data.recurrenceDays?.forEach((day) => {
    const time = data.recurrenceTimes?.[day];
    if (!time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecciona un horario para este día',
        path: ['recurrenceTimes', day],
      });
      return;
    }

    if (!TIME_SLOTS.includes(time as (typeof TIME_SLOTS)[number])) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Horario no válido',
        path: ['recurrenceTimes', day],
      });
    }
  });
};

export const adminAppointmentSchema = adminAppointmentBaseSchema
  .extend({
    isRecurring: z.boolean().default(false),
    date: z.date().optional(),
    time: z.string().optional(),
    recurrenceStartDate: z.date().optional(),
    recurrenceEndDate: z.date().optional(),
    recurrenceDays: z.array(z.enum(RECURRENCE_DAY_VALUES)).default([]),
    recurrenceTimes: z
      .record(z.enum(RECURRENCE_DAY_VALUES), z.string())
      .default({}),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring) {
      validateRecurringAppointment(data, ctx);
    } else {
      validateSingleAppointment(data, ctx);
    }
  });

export type AdminAppointmentFormValues = z.input<typeof adminAppointmentSchema>;

export type SingleAppointmentValues = Omit<
  AdminAppointmentFormValues,
  | 'recurrenceStartDate'
  | 'recurrenceEndDate'
  | 'recurrenceDays'
  | 'recurrenceTimes'
> & {
  isRecurring: false;
  date: Date;
  time: string;
};

export type RecurringAppointmentValues = Omit<
  AdminAppointmentFormValues,
  'date' | 'time'
> & {
  isRecurring: true;
  recurrenceStartDate: Date;
  recurrenceDays: RecurrenceDay[];
  recurrenceTimes: Partial<Record<RecurrenceDay, string>>;
};

export const isRecurringAppointment = (
  data: AdminAppointmentFormValues,
): data is RecurringAppointmentValues => data.isRecurring === true;

export const isSingleAppointment = (
  data: AdminAppointmentFormValues,
): data is SingleAppointmentValues => data.isRecurring === false;
