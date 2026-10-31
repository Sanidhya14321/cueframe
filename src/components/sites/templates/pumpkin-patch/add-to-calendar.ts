import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import { downloadEventCalendar } from '../../kit/calendar-download';

export const addShowerToCalendar = ({ family, event }: PumpkinPatchContent): void => {
  downloadEventCalendar({
    title: `${family.parentOne} & ${family.parentTwo}'s baby shower`,
    startsAt: event.startsAt,
    hours: event.hours,
    location: `${event.venue}, ${event.address}`,
  });
};
