'use client';

import { useEffect, useState } from 'react';
import { type CountdownParts, countdownParts, parseLocalDateTime } from '@/sites/event-date';

export const COUNTDOWN_UNITS: readonly { key: keyof CountdownParts; label: string }[] = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
];

export const useCountdown = (startsAt: string): CountdownParts | null => {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const target = parseLocalDateTime(startsAt);
  return now === null || target === null ? null : countdownParts(target, now);
};
