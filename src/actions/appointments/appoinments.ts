'use server';

import { createClient } from '@/config/supabase/server';
import { Appointment } from '@/types/appointment';
import { AppointmentFormValues } from '@/validation/appointment';
import { revalidatePath } from 'next/cache';

export async function createAppointment(data: AppointmentFormValues) {
  const supabase = await createClient();

  const { error } = await supabase.from('appointments').insert([
    {
      name: data.name,
      email: data.email,
      date: data.date.toISOString().split('T')[0], // ensure YYYY-MM-DD format
      time: data.time,
      service: data.service,
      message: data.message,
      status: 'pending',
    },
  ]);

  if (error) throw new Error(error.message);
}

export async function getBookedTimeSlotsByDate(date: Date): Promise<string[]> {
  const supabase = await createClient();

  const formattedDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'

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
export async function getAllAppointments({
  limit = 10,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}): Promise<{ data: Appointment[]; total: number }> {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from('appointments')
    .select('*', { count: 'exact' }) // Enable counting total rows
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching appointments:', error);
    throw new Error('No se pudieron obtener las citas');
  }

  return {
    data: data || [],
    total: count || 0,
  };
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
