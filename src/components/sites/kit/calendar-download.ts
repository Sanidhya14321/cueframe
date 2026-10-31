import { calendarFile } from '@/sites/calendar';
import { slugify } from '@/sites/slug';

export interface EventDetails {
  title: string;
  startsAt: string;
  hours: number;
  location: string;
}

export const downloadEventCalendar = (event: EventDetails): void => {
  const file = calendarFile(
    {
      id: slugify(`${event.title} ${event.startsAt}`),
      title: event.title,
      startsAt: event.startsAt,
      hours: event.hours,
      location: event.location,
      description: window.location.href,
    },
    new Date(),
  );
  if (file === null) {
    return;
  }
  const url = URL.createObjectURL(new Blob([file], { type: 'text/calendar' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slugify(event.title)}.ics`;
  link.click();
  URL.revokeObjectURL(url);
};
