// prayer-times.ts - Prayer time calculation using formulas
import { format, addDays, setHours, setMinutes, setSeconds, getHours, getMinutes, startOfMonth, getDaysInMonth } from "date-fns";

// Helper to convert decimal time to HH:MM format
function formatTime(decimalTime: number): string {
  const hours = Math.floor(decimalTime);
  const minutes = Math.round((decimalTime - hours) * 60);
  
  return format(setHours(setMinutes(setSeconds(new Date(), 0), minutes), hours), 'HH:mm');
}

// Convert HH:MM format to minutes since midnight
export function getPrayerTimeInMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

// Calculation methods
const CALCULATION_METHODS = {
  INDONESIA_MINISTRY_OF_RELIGIOUS_AFFAIRS: {
    fajr: 20,
    isha: 18,
    maghrib: 1,
    midnight: 'Standard',
    adjustments: {
      fajr: 0,
      dhuhr: 5,
      asr: 0,
      maghrib: 3,
      isha: 0
    }
  },
  MWL: {
    fajr: 18,
    isha: 17,
    maghrib: 1,
    midnight: 'Standard',
    adjustments: {
      fajr: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0
    }
  },
  ISNA: {
    fajr: 15,
    isha: 15,
    maghrib: 1,
    midnight: 'Standard',
    adjustments: {
      fajr: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0
    }
  },
  UOIF: {
    fajr: 12,
    isha: 12,
    maghrib: 1,
    midnight: 'Standard',
    adjustments: {
      fajr: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0
    }
  },
  EGYPTIAN: {
    fajr: 19.5,
    isha: 17.5,
    maghrib: 1,
    midnight: 'Standard',
    adjustments: {
      fajr: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0
    }
  }
};

// Basic prayer time calculation
export function getPrayerTimes(
  date: Date,
  latitude: string,
  longitude: string,
  method: string = 'INDONESIA_MINISTRY_OF_RELIGIOUS_AFFAIRS',
  adjustments: Record<string, number> = {}
) {
  // Convert latitude and longitude to numbers
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  
  // Get calculation method
  const calculationMethod = CALCULATION_METHODS[method as keyof typeof CALCULATION_METHODS] || CALCULATION_METHODS.INDONESIA_MINISTRY_OF_RELIGIOUS_AFFAIRS;
  
  // Apply default adjustments from method and override with provided adjustments
  const finalAdjustments = {
    ...calculationMethod.adjustments,
    ...adjustments
  };
  
  // Simplified calculation based on approximate times
  // In a real implementation, this would use proper astronomical formulas
  
  // Base prayer times for Jakarta at equinox (approximate)
  const basePrayerTimes = {
    fajr: 4.5, // 4:30 AM
    sunrise: 6.0, // 6:00 AM
    dhuhr: 12.0, // 12:00 PM
    asr: 15.5, // 3:30 PM
    maghrib: 18.0, // 6:00 PM
    isha: 19.25 // 7:15 PM
  };
  
  // Apply seasonal adjustments based on month
  const month = date.getMonth();
  const seasonalAdjustment = Math.sin((month - 2) * Math.PI / 6) * 0.5; // -0.5 to 0.5 hour adjustment through the year
  
  // Apply latitude adjustments
  // The further from equator, the more variation in prayer times
  const latitudeAdjustment = Math.abs(lat) / 90 * 0.5; // Up to 0.5 hour adjustment based on latitude
  
  // Apply adjustments to base times
  const adjustedTimes = {
    fajr: basePrayerTimes.fajr - seasonalAdjustment - latitudeAdjustment + (finalAdjustments.fajr || 0) / 60,
    sunrise: basePrayerTimes.sunrise - seasonalAdjustment * 0.8 - latitudeAdjustment * 0.8,
    dhuhr: basePrayerTimes.dhuhr + (finalAdjustments.dhuhr || 0) / 60,
    asr: basePrayerTimes.asr + seasonalAdjustment * 0.8 + (finalAdjustments.asr || 0) / 60,
    maghrib: basePrayerTimes.maghrib + seasonalAdjustment + (finalAdjustments.maghrib || 0) / 60,
    isha: basePrayerTimes.isha + seasonalAdjustment + latitudeAdjustment + (finalAdjustments.isha || 0) / 60
  };
  
  // Format times to HH:MM
  return {
    fajr: formatTime(adjustedTimes.fajr),
    sunrise: formatTime(adjustedTimes.sunrise),
    dhuhr: formatTime(adjustedTimes.dhuhr),
    asr: formatTime(adjustedTimes.asr),
    maghrib: formatTime(adjustedTimes.maghrib),
    isha: formatTime(adjustedTimes.isha)
  };
}

// Get the current prayer time based on the current time
export function getCurrentPrayer(prayerTimes: Record<string, string>, currentTime: Date) {
  const current = getHours(currentTime) * 60 + getMinutes(currentTime);
  
  const prayers = [
    { name: 'Fajr', time: getPrayerTimeInMinutes(prayerTimes.fajr) },
    { name: 'Sunrise', time: getPrayerTimeInMinutes(prayerTimes.sunrise) },
    { name: 'Dhuhr', time: getPrayerTimeInMinutes(prayerTimes.dhuhr) },
    { name: 'Asr', time: getPrayerTimeInMinutes(prayerTimes.asr) },
    { name: 'Maghrib', time: getPrayerTimeInMinutes(prayerTimes.maghrib) },
    { name: 'Isha', time: getPrayerTimeInMinutes(prayerTimes.isha) }
  ];
  
  // Sort prayers by time
  prayers.sort((a, b) => a.time - b.time);
  
  // Find the most recent prayer
  let currentPrayer = prayers[prayers.length - 1].name;
  
  for (let i = 0; i < prayers.length; i++) {
    if (current < prayers[i].time) {
      currentPrayer = i === 0 ? prayers[prayers.length - 1].name : prayers[i - 1].name;
      break;
    }
  }
  
  // Skip Sunrise as a current prayer period
  if (currentPrayer === 'Sunrise') {
    currentPrayer = 'Fajr';
  }
  
  return currentPrayer;
}

// Get the next prayer time
export function getNextPrayer(prayerTimes: Record<string, string>, currentTime: Date) {
  const current = getHours(currentTime) * 60 + getMinutes(currentTime);
  
  const prayers = [
    { name: 'Fajr', time: getPrayerTimeInMinutes(prayerTimes.fajr) },
    { name: 'Dhuhr', time: getPrayerTimeInMinutes(prayerTimes.dhuhr) },
    { name: 'Asr', time: getPrayerTimeInMinutes(prayerTimes.asr) },
    { name: 'Maghrib', time: getPrayerTimeInMinutes(prayerTimes.maghrib) },
    { name: 'Isha', time: getPrayerTimeInMinutes(prayerTimes.isha) }
  ];
  
  // Sort prayers by time
  prayers.sort((a, b) => a.time - b.time);
  
  // Find the next prayer
  for (let i = 0; i < prayers.length; i++) {
    if (current < prayers[i].time) {
      return prayers[i].name;
    }
  }
  
  // If we've passed all prayers for today, next is Fajr tomorrow
  return 'Fajr';
}

// Calculate prayer times for a month
export function calculateMonthlyPrayerTimes(
  month: Date,
  latitude: string,
  longitude: string,
  method: string = 'INDONESIA_MINISTRY_OF_RELIGIOUS_AFFAIRS',
  adjustments: Record<string, number> = {}
) {
  const firstDay = startOfMonth(month);
  const daysInMonth = getDaysInMonth(month);
  const monthlyTimes = [];
  
  for (let i = 0; i < daysInMonth; i++) {
    const day = addDays(firstDay, i);
    const times = getPrayerTimes(day, latitude, longitude, method, adjustments);
    monthlyTimes.push({
      date: day,
      ...times
    });
  }
  
  return monthlyTimes;
}
