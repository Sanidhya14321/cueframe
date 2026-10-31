import { describe, expect, it } from 'bun:test';
import { calendarFile, directionsUrl } from '@/sites/calendar';
import { countdownParts, describeEventDate, parseLocalDateTime } from '@/sites/event-date';

describe('event dates', () => {
  it('describes a local wedding time', () => {
    expect(describeEventDate('2028-08-15T15:00')).toMatchObject({
      day: '15',
      month: 'August',
      year: '2028',
      weekday: 'Tuesday',
      time: '3:00 PM',
    });
  });

  it('rejects malformed values', () => {
    expect(parseLocalDateTime('15/08/2028')).toBeNull();
    expect(describeEventDate('')).toBeNull();
  });

  it('counts down and stops at zero', () => {
    const target = new Date(2028, 7, 15, 15, 0);
    expect(countdownParts(target, new Date(2028, 7, 14, 13, 58, 30))).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 30,
    });
    expect(countdownParts(target, new Date(2029, 0, 1))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });
});

describe('calendar file', () => {
  it('writes a floating-time event with escaped text', () => {
    const file = calendarFile(
      {
        id: 'rachelle-and-thomas',
        title: 'Rachelle & Thomas, the wedding',
        startsAt: '2028-08-15T15:00',
        hours: 8,
        location: 'Oheka Castle; Huntington',
        description: 'See you there',
      },
      new Date(Date.UTC(2026, 9, 28, 12, 0, 0)),
    );
    const fields = new Map(
      (file ?? '')
        .split('\r\n')
        .map((line) => [line.slice(0, line.indexOf(':')), line.slice(line.indexOf(':') + 1)]),
    );
    expect(fields.get('DTSTART')).toBe('20280815T150000');
    expect(fields.get('DTEND')).toBe('20280815T230000');
    expect(fields.get('DTSTAMP')).toBe('20261028T120000Z');
    expect(fields.get('SUMMARY')).toBe('Rachelle & Thomas\\, the wedding');
    expect(fields.get('LOCATION')).toBe('Oheka Castle\\; Huntington');
    expect(file?.endsWith('\r\n')).toBe(true);
  });

  it('links directions to the address', () => {
    expect(directionsUrl('1 Main St, Town')).toEndWith(
      `destination=${encodeURIComponent('1 Main St, Town')}`,
    );
  });
});
