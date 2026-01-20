export interface Appointment {
  readonly id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  service: string;
  message: string;
  status?: string;
  series_id?: string | null;
  readonly created_at: string;
}

export type AppointmentFilter = 'all' | 'single' | 'series';

export const RECURRENCE_DAY_VALUES = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
] as const;

export type RecurrenceDay = (typeof RECURRENCE_DAY_VALUES)[number];

export const RECURRENCE_DAYS = [
  { value: 'monday', label: 'Lunes' },
  { value: 'tuesday', label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday', label: 'Jueves' },
  { value: 'friday', label: 'Viernes' },
] as const satisfies ReadonlyArray<{
  value: RecurrenceDay;
  label: string;
}>;

export interface SingleAppointmentPayload {
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  service: string;
  message?: string;
  turnstileToken: string;
}

export interface SingleAppointmentUpdatePayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  service: string;
  message?: string;
}

export interface RecurringAppointmentPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
  turnstileToken: string;
  recurrenceStartDate: Date;
  recurrenceEndDate?: Date;
  recurrenceDays: RecurrenceDay[];
  recurrenceTimes: Partial<Record<RecurrenceDay, string>>;
}

export interface RecurringScheduleUpdatePayload {
  seriesId: string;
  recurrenceDays: RecurrenceDay[];
  recurrenceTimes: Partial<Record<RecurrenceDay, string>>;
  startDate: Date;
  endDate: Date;
}

export interface AppointmentInsert {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  message?: string;
  status: 'pending';
  series_id?: string | null;
}

export interface RecurringAppointmentBuildParams {
  seriesId: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
  startDate: Date;
  endDate: Date;
  dayValues: RecurringAppointmentPayload['recurrenceDays'];
  timesByDay: RecurringAppointmentPayload['recurrenceTimes'];
}

export interface AppointmentSeries {
  readonly id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string | null;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  readonly created_at: string;
}

export interface AppointmentSeriesDay {
  readonly id: string;
  series_id: string;
  day_of_week: RecurrenceDay;
  time: string;
}

export interface AppointmentSeriesWithDays extends AppointmentSeries {
  appointment_series_days: AppointmentSeriesDay[];
}
