import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface PrayerSettingsProps {
  settings: any;
  isLoading: boolean;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

export default function PrayerSettings({ 
  settings, 
  isLoading, 
  onSubmit, 
  isPending 
}: PrayerSettingsProps) {
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    method: "INDONESIA_MINISTRY_OF_RELIGIOUS_AFFAIRS",
    timezone: "Asia/Jakarta",
    adjustments: {
      fajr: 0,
      dhuhr: 5,
      asr: 0,
      maghrib: 3,
      isha: 0
    }
  });
  
  useEffect(() => {
    if (settings) {
      setFormData({
        latitude: settings.latitude,
        longitude: settings.longitude,
        method: settings.method,
        timezone: settings.timezone,
        adjustments: settings.adjustments
      });
    }
  }, [settings]);
  
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 mr-2 animate-spin text-primary" />
        <p>Loading prayer settings...</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[250px]">
          <Label className="block text-sm font-medium mb-1">Location</Label>
          <div className="relative">
            <Select 
              value="custom" 
              onValueChange={(value) => {
                if (value === "jakarta") {
                  handleChange("latitude", "-6.2088");
                  handleChange("longitude", "106.8456");
                } else if (value === "bandung") {
                  handleChange("latitude", "-6.9175");
                  handleChange("longitude", "107.6191");
                } else if (value === "surabaya") {
                  handleChange("latitude", "-7.2575");
                  handleChange("longitude", "112.7521");
                }
              }}
            >
              <SelectTrigger className="w-full p-2 border border-neutral-300 rounded-lg appearance-none focus:outline-none focus:border-primary">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jakarta">Jakarta, Indonesia</SelectItem>
                <SelectItem value="bandung">Bandung, Indonesia</SelectItem>
                <SelectItem value="surabaya">Surabaya, Indonesia</SelectItem>
                <SelectItem value="custom">Custom Location...</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex-1 min-w-[250px]">
          <Label className="block text-sm font-medium mb-1">Calculation Method</Label>
          <div className="relative">
            <Select 
              value={formData.method}
              onValueChange={(value) => handleChange("method", value)}
            >
              <SelectTrigger className="w-full p-2 border border-neutral-300 rounded-lg appearance-none focus:outline-none focus:border-primary">
                <SelectValue placeholder="Select calculation method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INDONESIA_MINISTRY_OF_RELIGIOUS_AFFAIRS">Indonesian Ministry of Religious Affairs</SelectItem>
                <SelectItem value="MWL">Muslim World League</SelectItem>
                <SelectItem value="ISNA">Islamic Society of North America</SelectItem>
                <SelectItem value="UOIF">Union des Organisations Islamiques de France</SelectItem>
                <SelectItem value="EGYPTIAN">Egyptian General Authority of Survey</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[180px]">
          <Label className="block text-sm font-medium mb-1">Latitude</Label>
          <Input 
            type="text" 
            className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
            value={formData.latitude}
            onChange={(e) => handleChange("latitude", e.target.value)}
            placeholder="Enter latitude"
          />
        </div>
        
        <div className="flex-1 min-w-[180px]">
          <Label className="block text-sm font-medium mb-1">Longitude</Label>
          <Input 
            type="text" 
            className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
            value={formData.longitude}
            onChange={(e) => handleChange("longitude", e.target.value)}
            placeholder="Enter longitude"
          />
        </div>
        
        <div className="flex-1 min-w-[180px]">
          <Label className="block text-sm font-medium mb-1">Timezone</Label>
          <Select 
            value={formData.timezone}
            onValueChange={(value) => handleChange("timezone", value)}
          >
            <SelectTrigger className="w-full p-2 border border-neutral-300 rounded-lg appearance-none focus:outline-none focus:border-primary">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Jakarta">Asia/Jakarta (GMT+7)</SelectItem>
              <SelectItem value="Asia/Makassar">Asia/Makassar (GMT+8)</SelectItem>
              <SelectItem value="Asia/Jayapura">Asia/Jayapura (GMT+9)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition flex items-center"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Search className="mr-1 h-4 w-4" />
                <span>Generate Prayer Times</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
