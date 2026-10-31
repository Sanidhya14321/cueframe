export interface EventDate {
  date: Date;
  day: string;
  month: string;
  year: string;
  weekday: string;
  time: string;
}

const pattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

export const parseLocalDateTime = (value: string): Date | null => {
  const match = pattern.exec(value);
  if (match === null) {
    return null;
  }
  const [year, month, day, hour, minute] = match.slice(1).map(Number) as [
    number,
    number,
    number,
    number,
    number,
  ];
  const date = new Date(year, month - 1, day, hour, minute);
  return Number.isNaN(date.getTime()) ? null : date;
};

const part = (date: Date, options: Intl.DateTimeFormatOptions): string =>
  new Intl.DateTimeFormat('en-US', options).format(date);

export const describeEventDate = (value: string): EventDate | null => {
  const date = parseLocalDateTime(value);
  if (date === null) {
    return null;
  }
  return {
    date,
    day: String(date.getDate()),
    month: part(date, { month: 'long' }),
    year: String(date.getFullYear()),
    weekday: part(date, { weekday: 'long' }),
    time: part(date, { hour: 'numeric', minute: '2-digit' }),
  };
};

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const countdownParts = (target: Date, now: Date): CountdownParts => {
  const total = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
};
