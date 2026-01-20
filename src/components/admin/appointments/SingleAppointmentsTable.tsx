import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
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
  Appointment,
  AppointmentFilter,
  SingleAppointmentUpdatePayload,
} from '@/types/appointment';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ArrowUpDown,
  CalendarIcon,
  MoreVertical,
  PencilIcon,
  Trash2,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SERVICES, TIME_SLOTS } from '@/constants';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SingleAppointmentsTableProps {
  appointments: Appointment[];
  page: number;
  totalPages: number;
  isPending: boolean;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  filter: AppointmentFilter;
  onFilterChange: (value: AppointmentFilter) => void;
  sortBy: SortKey;
  sortDirection: SortDirection;
  onSortChange: (key: SortKey) => void;
  onUpdate: (payload: SingleAppointmentUpdatePayload) => Promise<void>;
}

export function SingleAppointmentsTable({
  appointments,
  page,
  totalPages,
  isPending,
  onDelete,
  onPageChange,
  filter,
  onFilterChange,
  sortBy,
  sortDirection,
  onSortChange,
  onUpdate,
}: SingleAppointmentsTableProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] =
    useState<Appointment | null>(null);

  const singleAppointmentSchema = z.object({
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
  });

  type SingleAppointmentFormValues = z.infer<typeof singleAppointmentSchema>;

  const form = useForm<SingleAppointmentFormValues>({
    resolver: zodResolver(singleAppointmentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      date: undefined,
      time: '',
      service: '',
      message: '',
    },
    mode: 'onBlur',
  });

  const openEditDialog = (appointment: Appointment) => {
    const appointmentDate = toLocalDate(appointment.date);
    setActiveAppointment(appointment);
    form.reset({
      name: appointment.name,
      email: appointment.email,
      phone: appointment.phone,
      date: appointmentDate,
      time: appointment.time.slice(0, 5),
      service: appointment.service,
      message: appointment.message ?? '',
    });
    setIsEditOpen(true);
  };

  const onSubmit = async (data: SingleAppointmentFormValues) => {
    if (!activeAppointment) return;
    if (!form.formState.isDirty) {
      return;
    }

    await onUpdate({
      id: activeAppointment.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      service: data.service,
      message: data.message,
    });

    setIsEditOpen(false);
    setActiveAppointment(null);
  };

  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-3 mb-4 sm:flex-nowrap'>
        <h2 id='appointments-table-heading' className='text-xl font-semibold'>
          Citas individuales
        </h2>
        <div className='w-full sm:w-auto overflow-x-auto'>
          <ToggleGroup
            type='single'
            variant='outline'
            size='sm'
            className='w-fit  text-xs sm:text-sm'
            value={filter}
            onValueChange={(value) => {
              if (value) {
                onFilterChange(value as AppointmentFilter);
              }
            }}
            aria-label='Filtrar citas individuales'>
            <ToggleGroupItem
              value='all'
              aria-label='Ver todas'
              className='flex-none'>
              Todas
            </ToggleGroupItem>
            <ToggleGroupItem
              value='single'
              aria-label='Ver citas individuales'
              className='flex-none'>
              Individuales
            </ToggleGroupItem>
            <ToggleGroupItem
              value='series'
              aria-label='Ver generadas por recurrencia'
              className='flex-none whitespace-nowrap text-center leading-none px-3 py-1.5 min-w-[120px]'>
              Recurrencia
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <Table className='min-w-[700px] table-auto'>
        <TableHeader>
          <TableRow>
            <TableHead aria-sort={getAriaSort(sortBy, sortDirection, 'name')}>
              <SortButton label='Nombre' onClick={() => onSortChange('name')} />
            </TableHead>
            <TableHead aria-sort={getAriaSort(sortBy, sortDirection, 'email')}>
              <SortButton label='Correo' onClick={() => onSortChange('email')} />
            </TableHead>
            <TableHead aria-sort={getAriaSort(sortBy, sortDirection, 'date')}>
              <SortButton label='Fecha' onClick={() => onSortChange('date')} />
            </TableHead>
            <TableHead aria-sort={getAriaSort(sortBy, sortDirection, 'time')}>
              <SortButton label='Hora' onClick={() => onSortChange('time')} />
            </TableHead>
            <TableHead aria-sort={getAriaSort(sortBy, sortDirection, 'service')}>
              <SortButton
                label='Servicio'
                onClick={() => onSortChange('service')}
              />
            </TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className='text-center text-muted-foreground py-6'>
                {filter === 'all'
                  ? 'No hay citas registradas.'
                  : 'No hay citas para este filtro.'}
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className='max-w-[140px] truncate'>
                  <TruncatedText text={appointment.name} />
                </TableCell>
                <TableCell className='max-w-[140px] truncate'>
                  <TruncatedText text={appointment.email} />
                </TableCell>
                <TableCell className='max-w-[140px] truncate'>
                  {format(parseISO(appointment.date.toString()), 'PPP', {
                    locale: es,
                  })}
                </TableCell>
                <TableCell className='max-w-[140px] truncate'>
                  {appointment.time}
                </TableCell>
                <TableCell className='max-w-[140px] truncate'>
                  <TruncatedText text={appointment.service} />
                </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='rounded-full'
                      aria-label={`Opciones de la cita de ${appointment.name}`}
                      disabled={isPending}>
                      <MoreVertical className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={() => openEditDialog(appointment)}
                      className='gap-2 text-blue-600'>
                      <PencilIcon className='h-4 w-4 text-blue-600' />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(appointment.id)}
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
          aria-label='Paginación de citas'>
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
            <DialogTitle>Editar cita</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='edit-name'>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id='edit-name'
                        placeholder='Nombre completo'
                        aria-describedby='edit-name-error'
                      />
                    </FormControl>
                    <FormMessage id='edit-name-error' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='edit-email'>Correo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id='edit-email'
                        type='email'
                        placeholder='email@ejemplo.com'
                        aria-describedby='edit-email-error'
                      />
                    </FormControl>
                    <FormMessage id='edit-email-error' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='edit-phone'>Teléfono</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id='edit-phone'
                        type='tel'
                        placeholder='Número de teléfono'
                        minLength={10}
                        maxLength={15}
                        aria-describedby='edit-phone-error'
                      />
                    </FormControl>
                    <FormMessage id='edit-phone-error' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel htmlFor='edit-date'>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            id='edit-date'
                            variant='outline'
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                            aria-describedby='edit-date-error'>
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
                          defaultMonth={field.value ?? new Date()}
                          disabled={(date) => date < new Date()}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage id='edit-date-error' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='time'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='edit-time'>Horario</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
                          id='edit-time'
                          aria-describedby='edit-time-error'>
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
                    <FormMessage id='edit-time-error' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='service'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='edit-service'>Servicio</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
                          id='edit-service'
                          aria-describedby='edit-service-error'>
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
                    <FormMessage id='edit-service-error' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='message'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='edit-message'>Mensaje</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id='edit-message'
                        placeholder='Notas importantes...'
                        rows={3}
                        aria-describedby='edit-message-error'
                      />
                    </FormControl>
                    <FormMessage id='edit-message-error' />
                  </FormItem>
                )}
              />

              <div className='flex gap-2 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsEditOpen(false)}
                  className='flex-1'>
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  disabled={isPending || !form.formState.isDirty}
                  className='flex-1'>
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

type SortKey = 'name' | 'email' | 'date' | 'time' | 'service';
type SortDirection = 'asc' | 'desc';

function getAriaSort(
  activeKey: SortKey,
  direction: SortDirection,
  key: SortKey,
) {
  if (activeKey !== key) {
    return 'none';
  }
  return direction === 'asc' ? 'ascending' : 'descending';
}

function SortButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type='button'
      variant='ghost'
      size='sm'
      onClick={onClick}
      className='h-8 px-2 text-muted-foreground hover:text-foreground'>
      <span className='text-xs font-medium'>{label}</span>
      <ArrowUpDown className='ml-1 h-3.5 w-3.5' />
    </Button>
  );
}

function toLocalDate(value: Date | string) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === 'string') {
    const [year, month, day] = value.split('-').map(Number);
    if (year && month && day) {
      return new Date(year, month - 1, day);
    }
  }

  const fallback = new Date(value);
  if (!isNaN(fallback.getTime())) {
    return new Date(
      fallback.getFullYear(),
      fallback.getMonth(),
      fallback.getDate(),
    );
  }

  return new Date();
}
function TruncatedText({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className='block truncate' title={text}>
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
