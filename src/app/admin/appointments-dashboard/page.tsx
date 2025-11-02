'use client';

import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  deleteAppointment,
  getAllAppointments,
} from '@/actions/appointments/appoinments';
import { Appointment } from '@/types/appointment';
import { AdminAppointmentForm } from '@/components/appointment-client/AdminAppointmentForm';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 5;

export default function AppointmentsDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchAppointments = async (pageNumber: number) => {
    try {
      const { data, total } = await getAllAppointments({
        limit: PAGE_SIZE,
        offset: (pageNumber - 1) * PAGE_SIZE,
      });

      setAppointments(data);
      setTotal(total);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('No se pudieron cargar las citas.');
    }
  };

  const refreshAppointments = () => {
    fetchAppointments(page);
  };

  useEffect(() => {
    fetchAppointments(page);
  }, [page]);

  const handleDelete = (id: string) => {
    const confirmDelete = confirm(
      '¿Estás seguro de que deseas eliminar esta cita?',
    );
    if (!confirmDelete) return;

    startTransition(async () => {
      try {
        await deleteAppointment(id);
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        toast.success('Cita eliminada correctamente.');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        toast.error('No se pudo eliminar la cita.');
      }
    });
  };

  return (
    <main className='max-w-6xl mx-auto px-4 py-10 mt-10'>
      <header className='mb-8'>
        <h1 className='text-3xl font-bold text-center text-primary mb-2'>
          Panel de Citas
        </h1>
        <p className='text-center text-muted-foreground mb-6'>
          Gestiona todas las citas y crea nuevas reservas administrativas
        </p>

        <div className='flex justify-center'>
          <AdminAppointmentForm onSuccess={refreshAppointments} />
        </div>
      </header>

      <section
        aria-labelledby='appointments-table-heading'
        className='bg-card rounded-lg border p-6'>
        <h2
          id='appointments-table-heading'
          className='text-xl font-semibold mb-4 sr-only'>
          Lista de Citas Programadas
        </h2>

        <Table className='min-w-[700px] table-auto'>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center text-muted-foreground py-6'>
                  No hay citas registradas.
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className='max-w-[140px] truncate'>
                    {appointment.name}
                  </TableCell>
                  <TableCell className='max-w-[140px] truncate'>
                    {appointment.email}
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
                    {appointment.service}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDelete(appointment.id!)}
                      aria-label={`Eliminar cita de ${appointment.name}`}>
                      Eliminar
                    </Button>
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
              onClick={() => setPage((p) => p - 1)}
              aria-label='Página anterior'>
              Anterior
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                size='sm'
                variant={p === page ? 'default' : 'outline'}
                onClick={() => setPage(p)}
                aria-label={`Ir a la página ${p}`}>
                {p}
              </Button>
            ))}

            <Button
              size='sm'
              variant='outline'
              disabled={page === totalPages || isPending}
              onClick={() => setPage((p) => p + 1)}
              aria-label='Página siguiente'>
              Siguiente
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
