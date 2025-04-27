import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getPrayerTimes, getCurrentPrayer, getNextPrayer, getPrayerTimeInMinutes } from "@/lib/prayer-times";
import { format } from "date-fns";

interface CurrentPrayerProps {
  settings: any;
}

export default function CurrentPrayer({ settings }: CurrentPrayerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeUntilNext, setTimeUntilNext] = useState("");
  
  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate time until next prayer
  useEffect(() => {
    if (!settings) return;
    
    const calculateTimeUntilNext = () => {
      const now = new Date();
      const prayers = getPrayerTimes(now, settings.latitude, settings.longitude, settings.method, settings.adjustments);
      const nextPrayer = getNextPrayer(prayers, now);
      
      if (!nextPrayer) return "";
      
      const nextPrayerTime = prayers[nextPrayer.toLowerCase()];
      if (!nextPrayerTime) return "";
      
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const nextPrayerMinutes = getPrayerTimeInMinutes(nextPrayerTime);
      
      let diff = nextPrayerMinutes - nowMinutes;
      if (diff < 0) diff += 24 * 60; // Next prayer is tomorrow
      
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      
      return `Next: ${nextPrayer} in ${hours}h ${minutes}m`;
    };
    
    setTimeUntilNext(calculateTimeUntilNext());
    
    const interval = setInterval(() => {
      setTimeUntilNext(calculateTimeUntilNext());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [settings, currentDate]);
  
  if (!settings) {
    return (
      <Card className="bg-white rounded-xl shadow-md mb-6 border-l-4 border-primary">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <p>Loading prayer times...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const prayers = getPrayerTimes(currentDate, settings.latitude, settings.longitude, settings.method, settings.adjustments);
  const currentPrayer = getCurrentPrayer(prayers, currentDate);
  
  return (
    <Card className="bg-white rounded-xl shadow-md mb-6 border-l-4 border-primary">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">Current Prayer Time</h2>
          <div className="text-sm text-neutral-500">{format(currentDate, 'EEEE, dd MMMM yyyy')}</div>
        </div>
        
        <div className="bg-primary bg-opacity-10 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-arabic font-bold text-primary-dark">{currentPrayer || "N/A"}</h3>
              <p className="text-sm opacity-75">Current Prayer</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {currentPrayer ? prayers[currentPrayer.toLowerCase()] : "N/A"}
              </div>
              <div className="text-sm pulse rounded-full px-3 py-1 bg-primary text-white inline-block">
                {timeUntilNext}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(prayers)
            .filter(([name]) => ["fajr", "dhuhr", "asr", "maghrib", "isha"].includes(name))
            .map(([name, time]) => {
              const isCurrent = currentPrayer?.toLowerCase() === name;
              return (
                <div 
                  key={name}
                  className={`text-center p-2 rounded-lg transition ${
                    isCurrent ? "bg-primary-light text-white" : "bg-neutral-100"
                  }`}
                >
                  <div className="text-sm font-medium">{name.charAt(0).toUpperCase() + name.slice(1)}</div>
                  <div className="text-lg font-bold">{time}</div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
