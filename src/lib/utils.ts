import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateGoogleCalendarLink({
  name,
  service,
  date,
  time,
}: {
  name: string;
  service: string;
  date: string;
  time: string;
}) {
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // +1h

  const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d{3}/g, '');

  const startStr = formatDate(start);
  const endStr = formatDate(end);

  const url = new URL('https://www.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', `Cita: ${service}`);
  url.searchParams.set('details', `Cita agendada con ${name}. Te esperamos 😊`);
  url.searchParams.set('dates', `${startStr}/${endStr}`);

  return url.toString();
}

export function generateICS({
  title,
  description,
  startTime,
  endTime,
  location,
}: {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}): string {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(startTime)}`,
    `DTEND:${formatDate(endTime)}`,
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description}` : '',
    location ? `LOCATION:${location}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}
