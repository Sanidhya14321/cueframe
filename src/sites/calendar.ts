import { parseLocalDateTime } from './event-date';

export interface CalendarEvent {
  id: string;
  title: string;
  startsAt: string;
  hours: number;
  location: string;
  description: string;
}

const pad = (value: number): string => String(value).padStart(2, '0');

const floating = (date: Date): string =>
  `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;

const stamp = (date: Date): string => date.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');

const escapeText = (text: string): string =>
  text
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/([,;])/g, '\\$1');

export const calendarFile = (event: CalendarEvent, now: Date): string | null => {
  const start = parseLocalDateTime(event.startsAt);
  if (start === null) {
    return null;
  }
  const end = new Date(start.getTime() + event.hours * 3_600_000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//neuclip//sites//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@neuclip`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${floating(start)}`,
    `DTEND:${floating(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `LOCATION:${escapeText(event.location)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
};

export const mapEmbedUrl = (address: string): string =>
  `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;

export const directionsUrl = (address: string): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
