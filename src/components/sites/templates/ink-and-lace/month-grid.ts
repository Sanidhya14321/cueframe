export const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

export interface MonthCell {
  key: string;
  day: number | null;
}

export const monthGrid = (date: Date): MonthCell[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const leading = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const total = Math.ceil((leading + days) / 7) * 7;
  return Array.from({ length: total }, (_, index) => {
    const day = index - leading + 1;
    return { key: `cell-${index}`, day: day >= 1 && day <= days ? day : null };
  });
};

const SUFFIXES: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };

export const ordinal = (day: number): string => {
  const teen = day % 100 >= 11 && day % 100 <= 13;
  return `${day}${teen ? 'th' : (SUFFIXES[day % 10] ?? 'th')}`;
};
