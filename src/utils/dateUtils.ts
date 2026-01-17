import { format, isToday, isYesterday, parseISO, startOfDay } from 'date-fns';

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'MMM d, yyyy');
}

/**
 * Format a date for display (e.g., "Monday, January 15, 2026")
 */
export function formatLongDate(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Get the start of day for a date string
 */
export function getStartOfDay(dateString: string): Date {
  return startOfDay(parseISO(dateString));
}

/**
 * Check if a date string is today
 */
export function isTodayString(dateString: string): boolean {
  return isToday(parseISO(dateString));
}

/**
 * Calculate days between two date strings
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = startOfDay(parseISO(date1));
  const d2 = startOfDay(parseISO(date2));
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get day of week from date string (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(dateString: string): number {
  return parseISO(dateString).getDay();
}

/**
 * Check if date is within a date range
 */
export function isDateInRange(date: string, start: string, end: string): boolean {
  return date >= start && date <= end;
}
