import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AppointmentSeriesWithDays,
  RECURRENCE_DAYS,
  RECURRENCE_DAY_VALUES,
  RecurrenceDay,
  RecurringScheduleUpdatePayload,
} from '@/types/appointment';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TIME_SLOTS } from '@/constants';
import { cn } from '@/lib/utils';
import { CalendarIcon, MoreVertical, PencilIcon, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface RecurringAppointmentsTableProps {
  series: AppointmentSeriesWithDays[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onUpdateSchedule: (payload: RecurringScheduleUpdatePayload) => Promise<void>;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
}

export function RecurringAppointmentsTable({
  series,
  isLoading,
  onDelete,
  onUpdateSchedule,
  page,
  totalPages,
  onPageChange,
  isPending = false,
}: RecurringAppointmentsTableProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeSeries, setActiveSeries] =
    useState<AppointmentSeriesWithDays | null>(null);

  const recurrenceDayLabels = useMemo(() => {
    return Object.fromEntries(
      RECURRENCE_DAYS.map((day) => [day.value, day.label]),
    ) as Record<string, string>;
  }, []);

  const scheduleSchema = z
    .object({
      startDate: z.date({ required_error: 'Selecciona una fecha de inicio' }),
      endDate: z.date({ required_error: 'Selecciona una fecha de fin' }),
      recurrenceDays: z
        .array(z.enum(RECURRENCE_DAY_VALUES))
        .min(1, 'Selecciona al menos un día'),
      recurrenceTimes: z
        .record(z.enum(RECURRENCE_DAY_VALUES), z.string())
        .default({}),
    })
    .superRefine((data, ctx) => {
      if (data.endDate && data.endDate < data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La fecha de fin debe ser posterior a la de inicio',
          path: ['endDate'],
        });
      }

      data.recurrenceDays.forEach((day) => {
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
    });

  type ScheduleFormValues = z.input<typeof scheduleSchema>;

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      recurrenceDays: [],
      recurrenceTimes: {},
    },
  });

  const selectedRecurrenceDays = form.watch('recurrenceDays') ?? [];

  const openEditDialog = (item: AppointmentSeriesWithDays) => {
    const days = item.appointment_series_days.map((day) => day.day_of_week);
    const times = item.appointment_series_days.reduce(
      (acc, day) => {
        acc[day.day_of_week] = day.time.slice(0, 5);
        return acc;
      },
      {} as Record<RecurrenceDay, string>,
    );

    const startDate = parseISO(item.start_date);
    const endDate = item.end_date
      ? parseISO(item.end_date)
      : parseISO(item.start_date);

    setActiveSeries(item);
    form.reset({
      startDate,
      endDate,
      recurrenceDays: days,
      recurrenceTimes: times,
    });
    setIsEditOpen(true);
  };

  const onSubmit = async (data: ScheduleFormValues) => {
    if (!activeSeries) return;
    if (!data.startDate || !data.endDate) {
      return;
    }

    await onUpdateSchedule({
      seriesId: activeSeries.id,
      startDate: data.startDate,
      endDate: data.endDate,
      recurrenceDays: data.recurrenceDays,
      recurrenceTimes: data.recurrenceTimes ?? {},
    });

    setIsEditOpen(false);
    setActiveSeries(null);
  };

  return (
    <>
      <h2 id='recurrence-table-heading' className='text-xl font-semibold mb-4'>
        Recurrencias activas
      </h2>

      <Table className='min-w-[700px] w-full table-fixed'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[22%]'>Cliente</TableHead>
            <TableHead className='w-[18%]'>Servicio</TableHead>
            <TableHead className='w-[20%]'>Rango</TableHead>
            <TableHead className='w-[28%]'>Días y horas</TableHead>
            <TableHead className='w-[8%] text-right'>Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className='text-center text-muted-foreground py-6'>
                Cargando recurrencias...
              </TableCell>
            </TableRow>
          ) : series.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className='text-center text-muted-foreground py-6'>
                No hay recurrencias registradas.
              </TableCell>
            </TableRow>
          ) : (
            series.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='max-w-[180px] truncate'>
                  <TruncatedText text={item.name} className='font-medium' />
                  <TruncatedText
                    text={item.email}
                    className='text-sm text-muted-foreground'
                  />
                </TableCell>
                <TableCell className='max-w-[160px] truncate'>
                  <TruncatedText text={item.service} />
                </TableCell>
                <TableCell className='max-w-[200px]'>
                  <TruncatedText
                    text={formatRange(item.start_date, item.end_date)}
                    className='text-sm text-foreground'
                  />
                </TableCell>
                <TableCell className='max-w-[220px]'>
                  <TruncatedText
                    text={formatDayTimes(
                      item.appointment_series_days,
                      recurrenceDayLabels,
                    )}
                    className='text-sm text-muted-foreground'
                  />
                </TableCell>
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='rounded-full'
                        aria-label={`Opciones de la recurrencia de ${item.name}`}
                        disabled={isPending}>
                        <MoreVertical className='w-4 h-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => openEditDialog(item)}
                        className='gap-2 text-blue-600'>
                        <PencilIcon className='h-4 w-4 text-blue-600' />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(item.id)}
                        className='gap-2 text-destructive'>
                        <Trash2 className='h-4 w-4 text-destructive' />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div
          className='flex justify-center items-center gap-2 mt-6'
          aria-label='Paginación de recurrencias'>
          <Button
            size='sm'
            variant='outline'
            disabled={page === 1 || isPending}
            onClick={() => onPageChange(page - 1)}
            aria-label='Página anterior'>
            Anterior
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              size='sm'
              variant={p === page ? 'default' : 'outline'}
              onClick={() => onPageChange(p)}
              aria-label={`Ir a la página ${p}`}>
              {p}
            </Button>
          ))}

          <Button
            size='sm'
            variant='outline'
            disabled={page === totalPages || isPending}
            onClick={() => onPageChange(page + 1)}
            aria-label='Página siguiente'>
            Siguiente
          </Button>
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Editar recurrencia</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel htmlFor='edit-start-date'>
                      Fecha de inicio
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            id='edit-start-date'
                            variant='outline'
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                            aria-describedby='edit-start-date-error'>
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
                          defaultMonth={field.value ?? new Date()}
                          disabled={(date) => date < new Date()}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage id='edit-start-date-error' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='endDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel htmlFor='edit-end-date'>
                      Fecha de fin (opcional)
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            id='edit-end-date'
                            variant='outline'
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                            aria-describedby='edit-end-date-error'>
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
                          defaultMonth={field.value ?? new Date()}
                          disabled={(date) => {
                            if (form.getValues('startDate')) {
                              return date < form.getValues('startDate');
                            }
                            return false;
                          }}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage id='edit-end-date-error' />
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
                              htmlFor={`edit-day-${day.value}`}
                              className={cn(
                                'flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                                isChecked
                                  ? 'border-primary/50 bg-primary/10'
                                  : 'border-border',
                              )}>
                              <input
                                id={`edit-day-${day.value}`}
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
                                    field.onChange([...field.value, day.value]);
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
                    <FormMessage />
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
                          <FormLabel htmlFor={`edit-time-${day}`}>
                            {recurrenceDayLabels[day] ?? day}
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
                                id={`edit-time-${day}`}
                                aria-describedby={`edit-time-${day}-error`}>
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
                          <FormMessage id={`edit-time-${day}-error`} />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              )}

              <div className='flex gap-2 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsEditOpen(false)}
                  className='flex-1'>
                  Cancelar
                </Button>
                <Button type='submit' disabled={isPending} className='flex-1'>
                  Guardar cambios
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatRange(startDate: string, endDate?: string | null) {
  const start = format(parseISO(startDate), 'PPP', { locale: es });
  if (!endDate) {
    return `${start} – Sin fin`;
  }
  return `${start} – ${format(parseISO(endDate), 'PPP', { locale: es })}`;
}

function formatDayTimes(
  days: AppointmentSeriesWithDays['appointment_series_days'],
  labels: Record<string, string>,
) {
  return days
    .map((day) => {
      const label = labels[day.day_of_week] ?? day.day_of_week;
      return `${label} ${day.time.slice(0, 5)}`;
    })
    .join(', ');
}

function TruncatedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`block truncate ${className ?? ''}`} title={text}>
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
