'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, generateGoogleCalendarLink, generateICS } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  AppointmentFormValues,
  appointmentSchema,
} from '@/validation/appointment';
import {
  createAppointment,
  getBookedTimeSlotsByDate,
} from '@/actions/appointments/appoinments';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { SERVICES, TIME_SLOTS } from '@/constants';
import { sendConfirmationEmail } from '@/actions/emails/send-confirmation-email';

export function AppointmentForm({
  onSuccess,
}: {
  onSuccess?: (data: AppointmentFormValues) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<AppointmentFormValues | null>(
    null,
  );
  const [availableSlots, setAvailableSlots] = useState<
    (typeof TIME_SLOTS)[number][]
  >([]);
  const [calendarUrl, setCalendarUrl] = useState<string | null>(null);
  const [icsUrl, setICSUrl] = useState<string | null>(null);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: '',
      email: '',
      date: undefined,
      time: '',
      service: '',
      message: '',
    },
    mode: 'onBlur',
  });

  const selectedDate = form.watch('date');

  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailableSlots = async () => {
      const bookedTimes = await getBookedTimeSlotsByDate(selectedDate);
      const freeSlots = TIME_SLOTS.filter(
        (slot) => !bookedTimes.includes(slot),
      );
      setAvailableSlots(freeSlots);
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  async function onSubmit(data: AppointmentFormValues) {
    setIsSubmitting(true);
    try {
      await createAppointment(data);

      const calendarLink = generateGoogleCalendarLink({
        name: data.name,
        service: data.service,
        date: data.date.toISOString().split('T')[0],
        time: data.time,
      });

      const startDateTime = new Date(
        `${data.date.toISOString().split('T')[0]}T${data.time}:00`,
      );
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1h

      const icsContent = generateICS({
        title: `Cita: ${data.service}`,
        description: `Sesión con Andrea (Tejiendo Historias) para ${data.name}`,
        startTime: startDateTime,
        endTime: endDateTime,
      });
      await sendConfirmationEmail(data, calendarLink, icsContent);

      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);

      setCalendarUrl(calendarLink);
      setICSUrl(url);
      setSuccessData(data);
      onSuccess?.(data);
      toast.success('Cita agendada, te contactaremos por correo.');
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo agendar la cita. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (successData) {
    return (
      <div className='text-center space-y-6 mt-10'>
        <h2 className='text-2xl font-semibold text-primary'>
          ¡Tu cita ha sido agendada!
        </h2>
        <p className='text-muted-foreground'>
          Gracias, <strong>{successData.name}</strong>. Has agendado una sesión
          de <strong>{successData.service}</strong> el{' '}
          <strong>
            {format(successData.date, 'PPP')} a las {successData.time}
          </strong>
          .
        </p>
        {successData.message && (
          <p className='text-sm italic text-muted-foreground'>
            Motivo de consulta: &quot;{successData.message}&quot;
          </p>
        )}

        <div className='flex flex-col items-center gap-2 mt-4'>
          {calendarUrl && (
            <a
              href={calendarUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline'>
              📅 Agregar al Google Calendar
            </a>
          )}

          {icsUrl && (
            <a
              href={icsUrl}
              download='cita-tejiendo-historias.ics'
              className='text-green-600 underline'>
              📄 Descargar archivo .ics
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
        aria-label='Formulario para agendar una cita'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='name'>Nombre completo</FormLabel>
              <FormControl>
                <Input
                  id='name'
                  placeholder='Tu nombre'
                  aria-required='true'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='email'>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  id='email'
                  type='email'
                  placeholder='tucorreo@email.com'
                  aria-required='true'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Fecha</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}>
                        {field.value ? (
                          format(field.value, 'PPP')
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='time'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Selecciona un horario' />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.length > 0 ? (
                        availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))
                      ) : (
                        <div className='px-4 py-2 text-muted-foreground'>
                          No hay horarios disponibles
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='service'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servicio</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecciona un servicio' />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICES.map((service) => (
                      <SelectItem key={service.id} value={service.title}>
                        {service.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='message'>
                Motivo de consulta (opcional)
              </FormLabel>
              <FormControl>
                <textarea
                  id='message'
                  className={cn(
                    'w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm',
                    'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                  placeholder='Cuéntanos brevemente si deseas'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className='w-full'>
          {isSubmitting ? 'Agendando...' : 'Agendar cita'}
        </Button>

        {calendarUrl && (
          <div className='text-center mt-4'>
            <a
              href={calendarUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='underline text-blue-600 hover:text-blue-800'>
              📅 Agregar esta cita a tu Google Calendar
            </a>
          </div>
        )}

        {icsUrl && (
          <div className='text-center mt-2'>
            <a
              href={icsUrl}
              download='cita-tejiendo-historias.ics'
              className='underline text-green-600 hover:text-green-800'>
              📄 Descargar evento como archivo .ics
            </a>
          </div>
        )}
      </form>
    </Form>
  );
}
