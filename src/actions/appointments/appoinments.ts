'use server';

import { createClient } from '@/config/supabase/server';
import {
  Appointment,
  AppointmentInsert,
  AppointmentFilter,
  AppointmentSeries,
  AppointmentSeriesWithDays,
  RecurringAppointmentBuildParams,
  RecurringAppointmentPayload,
  RecurringScheduleUpdatePayload,
  SingleAppointmentPayload,
  SingleAppointmentUpdatePayload,
} from '@/types/appointment';
import { addDays, addWeeks, isAfter } from 'date-fns';
import { revalidatePath } from 'next/cache';

export async function createSingleAppointment(data: SingleAppointmentPayload) {
  const supabase = await createClient();

  const { error } = await supabase.from('appointments').insert([
    {
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: formatDate(data.date),
      time: normalizeTime(data.time),
      service: data.service,
      message: data.message,
      status: 'pending',
    },
  ]);

  if (error) throw new Error(error.message);
}

export async function createRecurringAppointment(
  data: RecurringAppointmentPayload,
) {
  const supabase = await createClient();

  try {
    const normalizedStart = normalizeDate(data.recurrenceStartDate);
    const normalizedEnd = data.recurrenceEndDate
      ? normalizeDate(data.recurrenceEndDate)
      : addWeeks(normalizedStart, DEFAULT_RECURRENCE_WEEKS);

    await assertNoRecurringConflicts({
      supabase,
      occurrences: buildRecurringOccurrences({
        startDate: normalizedStart,
        endDate: normalizedEnd,
        dayValues: data.recurrenceDays,
        timesByDay: data.recurrenceTimes,
      }),
    });

    const { data: series, error: seriesError } = await supabase
      .from('appointment_series')
      .insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          message: data.message,
          start_date: formatDate(normalizedStart),
          end_date: data.recurrenceEndDate ? formatDate(normalizedEnd) : null,
          is_active: true,
        },
      ])
      .select('id')
      .single();

    if (seriesError || !series) {
      throw new Error(
        seriesError?.message ?? 'No se pudo crear la recurrencia.',
      );
    }

    const daysPayload = data.recurrenceDays.map((day) => {
      const time = data.recurrenceTimes?.[day];
      if (!time) {
        throw new Error(`Falta el horario para el día ${day}.`);
      }
      return {
        series_id: series.id,
        day_of_week: day,
        time: normalizeTime(time),
      };
    });

    const { error: daysError } = await supabase
      .from('appointment_series_days')
      .insert(daysPayload);

    if (daysError) {
      await supabase.from('appointment_series').delete().eq('id', series.id);
      throw new Error(daysError.message);
    }

    const appointmentsPayload = buildRecurringAppointments({
      seriesId: series.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      message: data.message,
      startDate: normalizedStart,
      endDate: normalizedEnd,
      dayValues: data.recurrenceDays,
      timesByDay: data.recurrenceTimes,
    });

    if (appointmentsPayload.length > 0) {
      const { error: appointmentsError } = await supabase
        .from('appointments')
        .insert(appointmentsPayload);

      if (appointmentsError) {
        await supabase.from('appointment_series').delete().eq('id', series.id);
        throw new Error(appointmentsError.message);
      }
    }

    return { ok: true as const };
  } catch (error) {
    console.error('Error creating recurring appointment:', error);
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : 'No se pudo crear la recurrencia.',
    };
  }
}

export async function getBookedTimeSlotsByDate(date: Date): Promise<string[]> {
  const supabase = await createClient();

  const formattedDate = formatDate(date);

  const { data, error } = await supabase
    .from('appointments')
    .select('time')
    .eq('date', formattedDate);

  if (error) {
    console.error('Error fetching booked times:', error);
    return [];
  }

  return data?.map((a) => a.time.slice(0, 5)) ?? [];
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function normalizeTime(value: string) {
  return value.length === 5 ? `${value}:00` : value;
}

function normalizeTimeKey(value: string) {
  return value.length >= 8 ? value.slice(0, 8) : normalizeTime(value);
}

function normalizeDate(value: Date) {
  const normalized = new Date(value);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

const DAY_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const DAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
] as const;

const DEFAULT_RECURRENCE_WEEKS = 12;

function buildRecurringAppointments({
  seriesId,
  name,
  email,
  phone,
  service,
  message,
  startDate,
  endDate,
  dayValues,
  timesByDay,
}: RecurringAppointmentBuildParams): AppointmentInsert[] {
  const targetDayIndexes = new Set(
    dayValues
      .map((day) => DAY_INDEX[day])
      .filter((index) => index !== undefined),
  );

  const appointments: AppointmentInsert[] = [];

  for (
    let cursor = startDate;
    !isAfter(cursor, endDate);
    cursor = addDays(cursor, 1)
  ) {
    if (!targetDayIndexes.has(cursor.getDay())) {
      continue;
    }

    const dayKey = getDayKey(cursor.getDay());
    if (!dayKey) {
      continue;
    }
    const time = timesByDay?.[dayKey];
    if (!time) {
      continue;
    }

    appointments.push({
      name,
      email,
      phone,
      date: formatDate(cursor),
      time: normalizeTime(time),
      service,
      message,
      status: 'pending',
      series_id: seriesId,
    });
  }

  return appointments;
}

function getDayKey(dayIndex: number) {
  return DAY_KEYS.find((key) => DAY_INDEX[key] === dayIndex);
}

function buildRecurringOccurrences({
  startDate,
  endDate,
  dayValues,
  timesByDay,
}: {
  startDate: Date;
  endDate: Date;
  dayValues: RecurringAppointmentPayload['recurrenceDays'];
  timesByDay: RecurringAppointmentPayload['recurrenceTimes'];
}) {
  const targetDayIndexes = new Set(
    dayValues
      .map((day) => DAY_INDEX[day])
      .filter((index) => index !== undefined),
  );

  const occurrences: { date: string; time: string }[] = [];

  for (
    let cursor = startDate;
    !isAfter(cursor, endDate);
    cursor = addDays(cursor, 1)
  ) {
    if (!targetDayIndexes.has(cursor.getDay())) {
      continue;
    }

    const dayKey = getDayKey(cursor.getDay());
    if (!dayKey) {
      continue;
    }

    const time = timesByDay?.[dayKey];
    if (!time) {
      continue;
    }

    occurrences.push({
      date: formatDate(cursor),
      time: normalizeTimeKey(time),
    });
  }

  return occurrences;
}

async function assertNoRecurringConflicts({
  supabase,
  occurrences,
  excludeSeriesId,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  occurrences: { date: string; time: string }[];
  excludeSeriesId?: string;
}) {
  if (occurrences.length === 0) {
    return;
  }

  const dateSet = new Set(occurrences.map((occurrence) => occurrence.date));
  const occurrenceKeySet = new Set(
    occurrences.map((occurrence) => `${occurrence.date}|${occurrence.time}`),
  );

  const dates = Array.from(dateSet).sort();
  const minDate = dates[0];
  const maxDate = dates[dates.length - 1];

  let query = supabase
    .from('appointments')
    .select('date, time, series_id')
    .gte('date', minDate)
    .lte('date', maxDate);

  if (excludeSeriesId) {
    query = query.or(
      `series_id.is.null,series_id.neq.${excludeSeriesId}`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const conflicts = (data ?? [])
    .map((row) => ({
      date: row.date as string,
      time: normalizeTimeKey(row.time),
    }))
    .filter((row) => occurrenceKeySet.has(`${row.date}|${row.time}`));

  if (conflicts.length === 0) {
    return;
  }

  const sample = conflicts.slice(0, 3);
  const details = sample
    .map((conflict) => `${conflict.date} ${conflict.time.slice(0, 5)}`)
    .join(', ');
  const suffix = conflicts.length > 3 ? '...' : '';

  throw new Error(
    `Hay conflictos de horario con citas existentes: ${details}${suffix}`,
  );
}

export async function getAllAppointments({
  limit = 10,
  offset = 0,
  filter = 'all',
  sortBy = 'date',
  sortDirection = 'desc',
}: {
  limit?: number;
  offset?: number;
  filter?: AppointmentFilter;
  sortBy?: 'name' | 'email' | 'date' | 'time' | 'service';
  sortDirection?: 'asc' | 'desc';
} = {}): Promise<{ data: Appointment[]; total: number }> {
  const supabase = await createClient();

  let query = supabase
    .from('appointments')
    .select('*', { count: 'exact' }) // Enable counting total rows
    .order(sortBy, { ascending: sortDirection === 'asc' });

  if (filter === 'single') {
    query = query.is('series_id', null);
  }

  if (filter === 'series') {
    query = query.not('series_id', 'is', null);
  }

  const { data, error, count } = await query.range(
    offset,
    offset + limit - 1,
  );

  if (error) {
    console.error('Error fetching appointments:', error);
    throw new Error('No se pudieron obtener las citas');
  }

  return {
    data: data || [],
    total: count || 0,
  };
}

export async function updateSingleAppointment(
  payload: SingleAppointmentUpdatePayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();

  try {
    const formattedDate = formatDate(payload.date);
    const normalizedTime = normalizeTime(payload.time);

    const { data: conflict, error: conflictError } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', formattedDate)
      .eq('time', normalizedTime)
      .neq('id', payload.id)
      .limit(1);

    if (conflictError) {
      throw new Error('No se pudo validar el horario.');
    }

    if (conflict && conflict.length > 0) {
      throw new Error('Ya existe una cita en ese horario.');
    }

    const { error } = await supabase
      .from('appointments')
      .update({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        date: formattedDate,
        time: normalizedTime,
        service: payload.service,
        message: payload.message ?? null,
      })
      .eq('id', payload.id);

    if (error) {
      throw new Error('No se pudo actualizar la cita.');
    }

    revalidatePath('/admin/appointments-dashboard');
    return { ok: true };
  } catch (error) {
    console.error('Error updating single appointment:', error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la cita.',
    };
  }
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('appointments').delete().eq('id', id);

  if (error) {
    console.error('Error deleting appointment:', error.message);
    throw new Error('No se pudo eliminar la cita.');
  }

  revalidatePath('/admin/appointments-dashboard');
}

export async function getAppointmentSeries({
  limit = 10,
  offset = 0,
  sortBy = 'created_at',
  sortDirection = 'desc',
}: {
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'service' | 'start_date' | 'end_date' | 'created_at';
  sortDirection?: 'asc' | 'desc';
} = {}): Promise<{ data: AppointmentSeriesWithDays[]; total: number }> {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from('appointment_series')
    .select(
      'id, name, email, phone, service, message, start_date, end_date, is_active, created_at, appointment_series_days(id, series_id, day_of_week, time)',
      { count: 'exact' },
    )
    .order(sortBy, { ascending: sortDirection === 'asc' })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching appointment series:', error);
    throw new Error('No se pudieron obtener las recurrencias.');
  }

  return {
    data: (data as AppointmentSeriesWithDays[]) ?? [],
    total: count ?? 0,
  };
}

export async function getAppointmentSeriesById(
  id: string,
): Promise<AppointmentSeriesWithDays | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('appointment_series')
    .select(
      'id, name, email, phone, service, message, start_date, end_date, is_active, created_at, appointment_series_days(id, series_id, day_of_week, time)',
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching appointment series by id:', error);
    throw new Error('No se pudo obtener la recurrencia.');
  }

  return data as AppointmentSeriesWithDays;
}

export async function updateAppointmentSeriesStatus(
  id: string,
  isActive: boolean,
): Promise<AppointmentSeries> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('appointment_series')
    .update({ is_active: isActive })
    .eq('id', id)
    .select(
      'id, name, email, phone, service, message, start_date, end_date, is_active, created_at',
    )
    .single();

  if (error || !data) {
    console.error('Error updating appointment series status:', error);
    throw new Error('No se pudo actualizar la recurrencia.');
  }

  return data as AppointmentSeries;
}

export async function updateAppointmentSeriesSchedule(
  payload: RecurringScheduleUpdatePayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  try {
    const { data: series, error: seriesError } = await supabase
      .from('appointment_series')
      .select('id, name, email, phone, service, message, start_date, end_date')
      .eq('id', payload.seriesId)
      .single();

    if (seriesError || !series) {
      throw new Error(seriesError?.message ?? 'No se encontró la recurrencia.');
    }

    if (
      !(payload.startDate instanceof Date) ||
      isNaN(payload.startDate.getTime())
    ) {
      throw new Error('Selecciona una fecha de inicio válida.');
    }

    if (!(payload.endDate instanceof Date) || isNaN(payload.endDate.getTime())) {
      throw new Error('Selecciona una fecha de fin válida.');
    }

    if (payload.endDate < payload.startDate) {
      throw new Error('La fecha de fin debe ser posterior a la de inicio.');
    }

    const daysPayload = payload.recurrenceDays.map((day) => {
      const time = payload.recurrenceTimes?.[day];
      if (!time) {
        throw new Error(`Falta el horario para el día ${day}.`);
      }
      return {
        series_id: payload.seriesId,
        day_of_week: day,
        time: normalizeTime(time),
      };
    });

    const today = normalizeDate(new Date());
    const seriesStart = normalizeDate(payload.startDate);
    const normalizedStart = seriesStart > today ? seriesStart : today;
    const normalizedEnd = normalizeDate(payload.endDate);

    await assertNoRecurringConflicts({
      supabase,
      excludeSeriesId: payload.seriesId,
      occurrences: buildRecurringOccurrences({
        startDate: normalizedStart,
        endDate: normalizedEnd,
        dayValues: payload.recurrenceDays,
        timesByDay: payload.recurrenceTimes,
      }),
    });

    const formattedStart = formatDate(payload.startDate);
    const formattedEnd = formatDate(payload.endDate);

    const { error: updateSeriesError } = await supabase
      .from('appointment_series')
      .update({
        start_date: formattedStart,
        end_date: formattedEnd,
      })
      .eq('id', payload.seriesId);

    if (updateSeriesError) {
      throw new Error(updateSeriesError.message);
    }

    const { error: deleteDaysError } = await supabase
      .from('appointment_series_days')
      .delete()
      .eq('series_id', payload.seriesId);

    if (deleteDaysError) {
      throw new Error(deleteDaysError.message);
    }

    const { error: insertDaysError } = await supabase
      .from('appointment_series_days')
      .insert(daysPayload);

    if (insertDaysError) {
      throw new Error(insertDaysError.message);
    }

    const { error: deleteAppointmentsError } = await supabase
      .from('appointments')
      .delete()
      .eq('series_id', payload.seriesId)
      .gte('date', formatDate(today));

    if (deleteAppointmentsError) {
      throw new Error(deleteAppointmentsError.message);
    }

    if (isAfter(normalizedStart, normalizedEnd)) {
      revalidatePath('/admin/appointments-dashboard');
      return { ok: true };
    }

    const appointmentsPayload = buildRecurringAppointments({
      seriesId: payload.seriesId,
      name: series.name,
      email: series.email,
      phone: series.phone,
      service: series.service,
      message: series.message ?? undefined,
      startDate: normalizedStart,
      endDate: normalizedEnd,
      dayValues: payload.recurrenceDays,
      timesByDay: payload.recurrenceTimes,
    });

    if (appointmentsPayload.length > 0) {
      const { error: insertAppointmentsError } = await supabase
        .from('appointments')
        .insert(appointmentsPayload);

      if (insertAppointmentsError) {
        throw new Error(insertAppointmentsError.message);
      }
    }

    revalidatePath('/admin/appointments-dashboard');
    return { ok: true };
  } catch (error) {
    console.error('Error updating appointment series schedule:', error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la recurrencia.',
    };
  }
}

export async function deleteAppointmentSeries(id: string) {
  const supabase = await createClient();

  const { error: appointmentsError } = await supabase
    .from('appointments')
    .delete()
    .eq('series_id', id);

  if (appointmentsError) {
    console.error(
      'Error deleting appointments for series:',
      appointmentsError.message,
    );
    throw new Error('No se pudieron eliminar las citas asociadas.');
  }

  const { error } = await supabase
    .from('appointment_series')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting appointment series:', error.message);
    throw new Error('No se pudo eliminar la recurrencia.');
  }

  revalidatePath('/admin/appointments-dashboard');
}
