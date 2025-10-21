export interface Appointment {
  readonly id: string;
  name: string;
  email: string;
  date: Date;
  time: string;
  service: string;
  message: string;
  readonly created_at: string;
}
