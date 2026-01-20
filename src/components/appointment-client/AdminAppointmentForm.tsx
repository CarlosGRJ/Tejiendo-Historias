'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Plus } from 'lucide-react';
import Turnstile from 'react-cloudflare-turnstile';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import {
  createSingleAppointment,
  createRecurringAppointment,
  getBookedTimeSlotsByDate,
} from '@/actions/appointments/appoinments';

import { SERVICES, TIME_SLOTS } from '@/constants';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';

import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  RECURRENCE_DAYS,
  RecurrenceDay,
  RecurringAppointmentPayload,
  SingleAppointmentPayload,
} from '@/types/appointment';
import {
  AdminAppointmentFormValues,
  adminAppointmentSchema,
  isRecurringAppointment,
  isSingleAppointment,
  RecurringAppointmentValues,
  SingleAppointmentValues,
} from '@/validation/admin-appointment';

export function AdminAppointmentForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const form = useForm<AdminAppointmentFormValues>({
    resolver: zodResolver(adminAppointmentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      date: undefined,
      time: '',
      service: '',
      message: '',
      isRecurring: false,
      recurrenceStartDate: undefined,
      recurrenceEndDate: undefined,
      recurrenceDays: [],
      recurrenceTimes: {},
      turnstileToken: '',
    },
    mode: 'onBlur',
  });

  const selectedDate = form.watch('date');
  const isRecurring = form.watch('isRecurring');
  const recurrenceStartDate = form.watch('recurrenceStartDate');
  const selectedRecurrenceDays = form.watch('recurrenceDays') ?? [];
  const recurrenceDaysByValue = useMemo(() => {
    const entries = RECURRENCE_DAYS.map((day) => [day.value, day]);
    return Object.fromEntries(entries) as Record<
      RecurrenceDay,
      (typeof RECURRENCE_DAYS)[number]
    >;
  }, []);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!selectedDate || isRecurring) {
      setBookedSlots([]);
      return;
    }

    const fetchBookedSlots = async () => {
      try {
        const booked = await getBookedTimeSlotsByDate(selectedDate);
        setBookedSlots(booked);
      } catch (error) {
        console.error('Error fetching booked slots:', error);
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [isRecurring, selectedDate]);

  useEffect(() => {
    if (isRecurring) {
      form.setValue('date', undefined, { shouldValidate: true });
      form.setValue('time', '', { shouldValidate: true });
      setBookedSlots([]);
      return;
    }

    form.setValue('recurrenceStartDate', undefined, { shouldValidate: true });
    form.setValue('recurrenceEndDate', undefined, { shouldValidate: true });
    form.setValue('recurrenceDays', [], { shouldValidate: true });
    form.setValue('recurrenceTimes', {}, { shouldValidate: true });
  }, [form, isRecurring]);

  async function handleCreateSingleAppointment(
    data: SingleAppointmentValues,
  ) {
    const payload: SingleAppointmentPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      service: data.service,
      message: data.message,
      turnstileToken: data.turnstileToken,
    };

    await createSingleAppointment(payload);
  }

  async function handleCreateRecurringAppointment(
    data: RecurringAppointmentValues,
  ) {
    const payload: RecurringAppointmentPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      message: data.message,
      turnstileToken: data.turnstileToken,
      recurrenceStartDate: data.recurrenceStartDate,
      recurrenceEndDate: data.recurrenceEndDate,
      recurrenceDays: data.recurrenceDays,
      recurrenceTimes: data.recurrenceTimes,
    };

    return createRecurringAppointment(payload);
  }

  const onSubmit = async (data: AdminAppointmentFormValues) => {
    setIsSubmitting(true);

    try {
      if (isRecurringAppointment(data)) {
        const result = await handleCreateRecurringAppointment(data);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
      } else if (isSingleAppointment(data)) {
        await handleCreateSingleAppointment(data);
      } else {
        toast.error('Completa el formulario antes de enviar.');
        return;
      }

      toast.success(
        data.isRecurring
          ? 'Cita recurrente configurada correctamente'
          : 'Cita creada exitosamente',
      );

      form.reset();
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error submitting appointment:', error);
      const message =
        error instanceof Error ? error.message : 'Error al procesar la cita';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSlotBooked = (timeSlot: string) => {
    return bookedSlots.includes(timeSlot);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='mb-6' aria-label='Crear nueva cita administrativa'>
          <Plus className='w-4 h-4 mr-2' />
          Nueva Cita
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Crear Nueva Cita</DialogTitle>
          <DialogDescription>
            Como administrador, puedes crear citas en cualquier horario para
            bloquear espacios o configurar una recurrencia.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='admin-name'>Nombre del Cliente</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='admin-name'
                      placeholder='Nombre completo'
                      aria-describedby='admin-name-error'
                    />
                  </FormControl>
                  <FormMessage id='admin-name-error' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='admin-email'>
                    Correo Electrónico
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='admin-email'
                      type='email'
                      placeholder='email@ejemplo.com'
                      aria-describedby='admin-email-error'
                    />
                  </FormControl>
                  <FormMessage id='admin-email-error' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='contact-phone'>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      id='contact-phone'
                      placeholder='Número de teléfono'
                      type='tel'
                      minLength={10}
                      maxLength={15}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isRecurring'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between gap-4 rounded-lg border p-3'>
                  <div>
                    <FormLabel
                      htmlFor='admin-recurring'
                      className='text-sm font-medium'>
                      Cita recurrente
                    </FormLabel>
                    <p className='text-sm text-muted-foreground'>
                      Activa esta opción para definir días y horarios fijos.
                    </p>
                  </div>
                  <FormControl>
                    <input
                      id='admin-recurring'
                      type='checkbox'
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      className='h-4 w-4 accent-primary'
                      aria-label='Activar cita recurrente'
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!isRecurring && (
              <>
                <FormField
                  control={form.control}
                  name='date'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel htmlFor='admin-date'>
                        Fecha de la Cita
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              id='admin-date'
                              variant='outline'
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                              aria-describedby='admin-date-error'>
                              {field.value ? (
                                format(field.value, 'PPP', { locale: es })
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const isPast = date < new Date();
                              const isWeekend =
                                date.getDay() === 0 || date.getDay() === 6;
                              return isPast || isWeekend;
                            }}
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage id='admin-date-error' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='time'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='admin-time'>Horario</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger
                            id='admin-time'
                            aria-describedby='admin-time-error'>
                            <SelectValue placeholder='Selecciona un horario' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIME_SLOTS.map((timeSlot) => {
                            const isBooked = isSlotBooked(timeSlot);
                            return (
                              <SelectItem
                                key={timeSlot}
                                value={timeSlot}
                                className={isBooked ? 'text-orange-600' : ''}>
                                {timeSlot}{' '}
                                {isBooked &&
                                  '(Ocupado - Admin puede sobrescribir)'}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage id='admin-time-error' />
                      {selectedDate && bookedSlots.length > 0 && (
                        <p className='text-sm text-muted-foreground'>
                          Los horarios marcados como ocupados pueden ser
                          sobrescritos por el admin.
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </>
            )}

            {isRecurring && (
              <>
                <FormField
                  control={form.control}
                  name='recurrenceStartDate'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel htmlFor='admin-recurrence-start'>
                        Fecha de inicio
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              id='admin-recurrence-start'
                              variant='outline'
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                              aria-describedby='admin-recurrence-start-error'>
                              {field.value ? (
                                format(field.value, 'PPP', { locale: es })
                              ) : (
                                <span>Selecciona la fecha de inicio</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage id='admin-recurrence-start-error' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='recurrenceEndDate'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel htmlFor='admin-recurrence-end'>
                        Fecha de fin (opcional)
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              id='admin-recurrence-end'
                              variant='outline'
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                              aria-describedby='admin-recurrence-end-error'>
                              {field.value ? (
                                format(field.value, 'PPP', { locale: es })
                              ) : (
                                <span>Selecciona la fecha de fin</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              if (recurrenceStartDate) {
                                return date < recurrenceStartDate;
                              }
                              return date < new Date();
                            }}
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage id='admin-recurrence-end-error' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='recurrenceDays'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Días de la semana
                      </FormLabel>
                      <FormControl>
                        <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
                        {RECURRENCE_DAYS.map((day) => {
                          const isChecked =
                            field.value?.includes(day.value) ?? false;
                          return (
                              <label
                                key={day.value}
                                htmlFor={`recurrence-day-${day.value}`}
                                className={cn(
                                  'flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                                  isChecked
                                    ? 'border-primary/50 bg-primary/10'
                                    : 'border-border',
                                )}>
                                <input
                                  id={`recurrence-day-${day.value}`}
                                  type='checkbox'
                                  checked={isChecked}
                                  onChange={() => {
                                    if (!field.value) {
                                      field.onChange([day.value]);
                                      return;
                                    }

                                    if (isChecked) {
                                      const nextDays = field.value.filter(
                                        (value) => value !== day.value,
                                      );
                                      const currentTimes =
                                        form.getValues('recurrenceTimes') ?? {};
                                      if (day.value in currentTimes) {
                                        const rest = Object.fromEntries(
                                          Object.entries(currentTimes).filter(
                                            ([key]) => key !== day.value,
                                          ),
                                        );
                                        form.setValue('recurrenceTimes', rest, {
                                          shouldValidate: true,
                                        });
                                        form.clearErrors(
                                          `recurrenceTimes.${day.value}`,
                                        );
                                      }
                                      field.onChange(nextDays);
                                    } else {
                                      field.onChange([
                                        ...field.value,
                                        day.value,
                                      ]);
                                    }
                                  }}
                                  className='h-4 w-4 accent-primary'
                                  aria-label={`Seleccionar ${day.label}`}
                                />
                                <span>{day.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage id='admin-recurrence-days-error' />
                    </FormItem>
                  )}
                />

                {selectedRecurrenceDays.length > 0 && (
                  <div className='space-y-3'>
                    <p className='text-sm font-medium'>
                      Horarios por día seleccionado
                    </p>
                    {selectedRecurrenceDays.map((day) => (
                      <FormField
                        key={day}
                        control={form.control}
                        name={`recurrenceTimes.${day}` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor={`recurrence-time-${day}`}>
                              {recurrenceDaysByValue[day].label}
                            </FormLabel>
                            <Select
                              value={field.value ?? ''}
                              onValueChange={(value) => {
                                form.setValue(
                                  `recurrenceTimes.${day}` as const,
                                  value,
                                  { shouldValidate: true },
                                );
                                form.clearErrors(`recurrenceTimes.${day}`);
                              }}>
                              <FormControl>
                                <SelectTrigger
                                  id={`recurrence-time-${day}`}
                                  aria-describedby={`recurrence-time-${day}-error`}>
                                <SelectValue placeholder='Selecciona un horario' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIME_SLOTS.map((timeSlot) => (
                                  <SelectItem key={timeSlot} value={timeSlot}>
                                    {timeSlot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage id={`recurrence-time-${day}-error`} />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            <FormField
              control={form.control}
              name='service'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='admin-service'>Servicio</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger
                        id='admin-service'
                        aria-describedby='admin-service-error'>
                        <SelectValue placeholder='Selecciona un servicio' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICES.map((service) => (
                        <SelectItem key={service.id} value={service.title}>
                          {service.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage id='admin-service-error' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='admin-message'>Mensaje</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id='admin-message'
                      placeholder='Describe el motivo de la cita o notas importantes...'
                      rows={3}
                      aria-describedby='admin-message-error'
                    />
                  </FormControl>
                  <FormMessage id='admin-message-error' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='turnstileToken'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verificación</FormLabel>
                  <FormControl>
                    <Turnstile
                      turnstileSiteKey={
                        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!
                      }
                      callback={(token) => field.onChange(token)}
                      theme='light'
                      size='normal'
                      retry='auto'
                      refreshExpired='auto'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsOpen(false)}
                className='flex-1'>
                Cancelar
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='flex-1'
                aria-label='Crear cita administrativa'>
                {isSubmitting ? 'Creando...' : 'Crear Cita'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
