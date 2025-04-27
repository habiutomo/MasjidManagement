import { 
  format, 
  formatDistanceToNow, 
  isToday, 
  isYesterday, 
  isThisWeek, 
  isThisMonth, 
  addDays,
  addMonths, 
  differenceInDays,
  parseISO,
  isValid
} from 'date-fns';

// Format a date in a human-readable way
export function formatDate(date: Date | string | number): string {
  let parsedDate: Date;
  
  if (typeof date === 'string') {
    try {
      parsedDate = parseISO(date);
      if (!isValid(parsedDate)) {
        return 'Invalid date';
      }
    } catch (error) {
      return 'Invalid date';
    }
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else {
    parsedDate = date;
  }
  
  if (isToday(parsedDate)) {
    return 'Today';
  } else if (isYesterday(parsedDate)) {
    return 'Yesterday';
  } else if (isThisWeek(parsedDate)) {
    return format(parsedDate, 'EEEE'); // Day name
  } else if (isThisMonth(parsedDate)) {
    return format(parsedDate, 'dd MMMM'); // Day and month
  } else {
    return format(parsedDate, 'dd MMMM yyyy'); // Full date
  }
}

// Format a date with time
export function formatDateTime(date: Date | string | number): string {
  let parsedDate: Date;
  
  if (typeof date === 'string') {
    try {
      parsedDate = parseISO(date);
      if (!isValid(parsedDate)) {
        return 'Invalid date';
      }
    } catch (error) {
      return 'Invalid date';
    }
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else {
    parsedDate = date;
  }
  
  if (isToday(parsedDate)) {
    return `Today at ${format(parsedDate, 'h:mm a')}`;
  } else if (isYesterday(parsedDate)) {
    return `Yesterday at ${format(parsedDate, 'h:mm a')}`;
  } else if (isThisWeek(parsedDate)) {
    return `${format(parsedDate, 'EEEE')} at ${format(parsedDate, 'h:mm a')}`;
  } else {
    return format(parsedDate, 'dd MMMM yyyy, h:mm a');
  }
}

// Format a relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date | string | number): string {
  let parsedDate: Date;
  
  if (typeof date === 'string') {
    try {
      parsedDate = parseISO(date);
      if (!isValid(parsedDate)) {
        return 'Invalid date';
      }
    } catch (error) {
      return 'Invalid date';
    }
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else {
    parsedDate = date;
  }
  
  return formatDistanceToNow(parsedDate, { addSuffix: true });
}

// Calculate days remaining until a date
export function getDaysRemaining(date: Date | string | number): number {
  let parsedDate: Date;
  
  if (typeof date === 'string') {
    try {
      parsedDate = parseISO(date);
      if (!isValid(parsedDate)) {
        return 0;
      }
    } catch (error) {
      return 0;
    }
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else {
    parsedDate = date;
  }
  
  const today = new Date();
  return differenceInDays(parsedDate, today);
}

// Check if a date is in the future
export function isFutureDate(date: Date | string | number): boolean {
  let parsedDate: Date;
  
  if (typeof date === 'string') {
    try {
      parsedDate = parseISO(date);
      if (!isValid(parsedDate)) {
        return false;
      }
    } catch (error) {
      return false;
    }
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else {
    parsedDate = date;
  }
  
  const today = new Date();
  return parsedDate > today;
}

// Add days to a date and return the new date
export function addDaysToDate(date: Date | string | number, days: number): Date {
  let parsedDate: Date;
  
  if (typeof date === 'string') {
    try {
      parsedDate = parseISO(date);
      if (!isValid(parsedDate)) {
        return new Date();
      }
    } catch (error) {
      return new Date();
    }
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else {
    parsedDate = date;
  }
  
  return addDays(parsedDate, days);
}

// Add months to a date and return the new date
export function addMonthsToDate(date: Date | string | number, months: number): Date {
  let parsedDate: Date;
  
  if (typeof date === 'string') {
    try {
      parsedDate = parseISO(date);
      if (!isValid(parsedDate)) {
        return new Date();
      }
    } catch (error) {
      return new Date();
    }
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else {
    parsedDate = date;
  }
  
  return addMonths(parsedDate, months);
}
