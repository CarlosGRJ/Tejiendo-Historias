'use client';

import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  deleteAppointment,
  getAppointmentSeries,
  getAllAppointments,
  deleteAppointmentSeries,
  updateAppointmentSeriesSchedule,
  updateSingleAppointment,
} from '@/actions/appointments/appoinments';
import {
  Appointment,
  AppointmentFilter,
  AppointmentSeriesWithDays,
  RecurringScheduleUpdatePayload,
  SingleAppointmentUpdatePayload,
} from '@/types/appointment';
import { AdminAppointmentForm } from '@/components/appointment-client/AdminAppointmentForm';
import { SingleAppointmentsTable } from '@/components/admin/appointments/SingleAppointmentsTable';
import { RecurringAppointmentsTable } from '@/components/admin/appointments/RecurringAppointmentsTable';

const PAGE_SIZE = 5;

export default function AppointmentsDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [appointmentFilter, setAppointmentFilter] =
    useState<AppointmentFilter>('all');
  const [series, setSeries] = useState<AppointmentSeriesWithDays[]>([]);
  const [isSeriesLoading, setIsSeriesLoading] = useState(true);
  const [seriesPage, setSeriesPage] = useState(1);
  const [seriesTotal, setSeriesTotal] = useState(0);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const seriesTotalPages = Math.ceil(seriesTotal / PAGE_SIZE);

  const fetchAppointments = async (
    pageNumber: number,
    filter: AppointmentFilter,
  ) => {
    try {
      const { data, total } = await getAllAppointments({
        limit: PAGE_SIZE,
        offset: (pageNumber - 1) * PAGE_SIZE,
        filter,
      });

      setAppointments(data);
      setTotal(total);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('No se pudieron cargar las citas.');
    }
  };

  const fetchAppointmentSeries = async () => {
    try {
      setIsSeriesLoading(true);
      const { data, total } = await getAppointmentSeries({
        limit: PAGE_SIZE,
        offset: (seriesPage - 1) * PAGE_SIZE,
      });
      setSeries(data);
      setSeriesTotal(total);
    } catch (error) {
      console.error('Error fetching appointment series:', error);
      toast.error('No se pudieron cargar las recurrencias.');
    } finally {
      setIsSeriesLoading(false);
    }
  };

  const refreshAppointments = () => {
    fetchAppointments(page, appointmentFilter);
    fetchAppointmentSeries();
  };

  useEffect(() => {
    fetchAppointments(page, appointmentFilter);
  }, [page, appointmentFilter]);

  useEffect(() => {
    fetchAppointmentSeries();
  }, [seriesPage]);

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

  const handleDeleteSeries = (id: string) => {
    const confirmDelete = confirm(
      '¿Estás seguro de que deseas eliminar esta recurrencia?',
    );
    if (!confirmDelete) return;

    startTransition(async () => {
      try {
        await deleteAppointmentSeries(id);
        setSeries((prev) => prev.filter((item) => item.id !== id));
        await fetchAppointments(page, appointmentFilter);
        toast.success('Recurrencia eliminada correctamente.');
      } catch (error) {
        console.error('Error deleting appointment series:', error);
        toast.error('No se pudo eliminar la recurrencia.');
      }
    });
  };


  const handleUpdateSeriesSchedule = async (
    payload: RecurringScheduleUpdatePayload,
  ) => {
    startTransition(async () => {
      try {
        const result = await updateAppointmentSeriesSchedule(payload);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        await fetchAppointmentSeries();
        await fetchAppointments(page, appointmentFilter);
        toast.success('Recurrencia actualizada correctamente.');
      } catch (error) {
        console.error('Error updating appointment series schedule:', error);
        toast.error('No se pudo actualizar la recurrencia.');
      }
    });
  };

  const handleUpdateSingleAppointment = async (
    payload: SingleAppointmentUpdatePayload,
  ) => {
    startTransition(async () => {
      try {
        const result = await updateSingleAppointment(payload);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        await fetchAppointments(page, appointmentFilter);
        toast.success('Cita actualizada correctamente.');
      } catch (error) {
        console.error('Error updating appointment:', error);
        toast.error('No se pudo actualizar la cita.');
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
        <SingleAppointmentsTable
          appointments={appointments}
          page={page}
          totalPages={totalPages}
          isPending={isPending}
          onDelete={handleDelete}
          onPageChange={setPage}
          filter={appointmentFilter}
          onFilterChange={(value) => {
            setAppointmentFilter(value);
            setPage(1);
          }}
          onUpdate={handleUpdateSingleAppointment}
        />
      </section>

      <section
        aria-labelledby='recurrence-table-heading'
        className='bg-card rounded-lg border p-6 mt-8'>
        <RecurringAppointmentsTable
          series={series}
          isLoading={isSeriesLoading}
          isPending={isPending}
          onDelete={handleDeleteSeries}
          onUpdateSchedule={handleUpdateSeriesSchedule}
          page={seriesPage}
          totalPages={seriesTotalPages}
          onPageChange={setSeriesPage}
        />
      </section>
    </main>
  );
}
