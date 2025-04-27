import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { MapPin, Sunrise, Sun, Sunset, Moon, CloudSun } from "lucide-react";
import { getPrayerTimes, getCurrentPrayer } from "@/lib/prayer-times";

interface TodaysPrayersProps {
  settings: any;
}

export default function TodaysPrayers({ settings }: TodaysPrayersProps) {
  const [currentPrayer, setCurrentPrayer] = useState("");
  const [today] = useState(new Date());
  
  // Update current prayer every minute
  useEffect(() => {
    if (!settings) return;
    
    const interval = setInterval(() => {
      const prayers = getPrayerTimes(new Date(), settings.latitude, settings.longitude, settings.method, settings.adjustments);
      setCurrentPrayer(getCurrentPrayer(prayers, new Date()) || "");
    }, 60000);
    
    // Initial calculation
    const prayers = getPrayerTimes(new Date(), settings.latitude, settings.longitude, settings.method, settings.adjustments);
    setCurrentPrayer(getCurrentPrayer(prayers, new Date()) || "");
    
    return () => clearInterval(interval);
  }, [settings]);
  
  if (!settings) {
    return (
      <Card className="bg-white rounded-xl shadow-md mb-6">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <p>Loading prayer times...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const prayers = getPrayerTimes(today, settings.latitude, settings.longitude, settings.method, settings.adjustments);
  
  return (
    <Card className="bg-white rounded-xl shadow-md mb-6">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-primary">Today's Prayers</h2>
          <p className="text-sm text-neutral-500">{format(today, 'EEEE, dd MMMM yyyy')}</p>
        </div>
        
        <div className="space-y-3">
          <div className={`flex justify-between p-3 rounded-lg ${
            currentPrayer === 'Fajr' ? 'bg-primary-light bg-opacity-20' : 'bg-neutral-50'
          }`}>
            <div className="flex items-center">
              <Sunrise className="text-primary mr-2 h-5 w-5" />
              <span className="font-medium">Fajr</span>
            </div>
            <div className="font-bold">{prayers.fajr}</div>
          </div>
          
          <div className="flex justify-between p-3 bg-neutral-50 rounded-lg">
            <div className="flex items-center">
              <Sunrise className="text-primary mr-2 h-5 w-5" />
              <span className="font-medium">Sunrise</span>
            </div>
            <div className="font-bold">{prayers.sunrise}</div>
          </div>
          
          <div className={`flex justify-between p-3 rounded-lg ${
            currentPrayer === 'Dhuhr' ? 'bg-primary-light bg-opacity-20' : 'bg-neutral-50'
          }`}>
            <div className="flex items-center">
              <Sun className="text-primary mr-2 h-5 w-5" />
              <span className="font-medium">Dhuhr</span>
            </div>
            <div className="font-bold">{prayers.dhuhr}</div>
          </div>
          
          <div className={`flex justify-between p-3 rounded-lg ${
            currentPrayer === 'Asr' ? 'bg-primary-light bg-opacity-20' : 'bg-neutral-50'
          }`}>
            <div className="flex items-center">
              <CloudSun className="text-primary mr-2 h-5 w-5" />
              <span className="font-medium">Asr</span>
            </div>
            <div className="font-bold">{prayers.asr}</div>
          </div>
          
          <div className={`flex justify-between p-3 rounded-lg ${
            currentPrayer === 'Maghrib' ? 'bg-primary-light bg-opacity-20' : 'bg-neutral-50'
          }`}>
            <div className="flex items-center">
              <Sunset className="text-primary mr-2 h-5 w-5" />
              <span className="font-medium">Maghrib</span>
            </div>
            <div className="font-bold">{prayers.maghrib}</div>
          </div>
          
          <div className={`flex justify-between p-3 rounded-lg ${
            currentPrayer === 'Isha' ? 'bg-primary-light bg-opacity-20' : 'bg-neutral-50'
          }`}>
            <div className="flex items-center">
              <Moon className="text-primary mr-2 h-5 w-5" />
              <span className="font-medium">Isha</span>
            </div>
            <div className="font-bold">{prayers.isha}</div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-sm bg-primary bg-opacity-10 py-2 px-3 rounded-lg inline-flex items-center">
            <MapPin className="text-primary mr-1 h-4 w-4" />
            <span>{settings.latitude}, {settings.longitude}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
