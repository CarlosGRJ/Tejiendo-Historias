'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  createAppointment,
  getBookedTimeSlotsByDate,
} from '@/actions/appointments/appoinments';

import { SERVICES, TIME_SLOTS } from '@/constants';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Admin-specific appointment schema (bypasses availability checks)
const adminAppointmentSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido' }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  date: z.date({ required_error: 'Selecciona una fecha válida' }),
  time: z
    .string()
    .min(1, { message: 'Selecciona un horario válido' })
    .refine((val) => TIME_SLOTS.includes(val as (typeof TIME_SLOTS)[number]), {
      message: 'Horario no válido',
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

type AdminAppointmentFormValues = z.infer<typeof adminAppointmentSchema>;

export function AdminAppointmentForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const form = useForm<AdminAppointmentFormValues>({
    resolver: zodResolver(adminAppointmentSchema),
    defaultValues: {
      name: '',
      email: '',
      date: undefined,
      time: '',
      service: '',
      message: 'Cancelación de hora',
      turnstileToken: '',
    },
    mode: 'onBlur',
  });

  const selectedDate = form.watch('date');

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!selectedDate) {
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
  }, [selectedDate]);

  const onSubmit = async (data: AdminAppointmentFormValues) => {
    setIsSubmitting(true);

    try {
      await createAppointment(data);

      toast.success('Cita creada exitosamente');
      form.reset();
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Error al crear la cita');
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
            bloquear espacios.
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
              name='date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel htmlFor='admin-date'>Fecha de la Cita</FormLabel>
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
                            {isBooked && '(Ocupado - Admin puede sobrescribir)'}
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
