import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Calendar, 
  HeartHandshake, 
  Clock, 
  BellRing,
  Clock3,
  Settings
} from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const [prayerAdjustments, setPrayerAdjustments] = useState({
    fajr: 0,
    dhuhr: 5,
    asr: 0,
    maghrib: 3,
    isha: 0
  });
  
  const { data: prayerSettings } = useQuery({
    queryKey: ['/api/prayer-settings'],
    onSuccess: (data) => {
      if (data && data.adjustments) {
        setPrayerAdjustments(data.adjustments);
      }
    }
  });
  
  const { data: events } = useQuery({
    queryKey: ['/api/events'],
  });
  
  const { data: donations } = useQuery({
    queryKey: ['/api/donations'],
  });
  
  const { data: campaigns } = useQuery({
    queryKey: ['/api/campaigns'],
  });
  
  const updatePrayerSettingsMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await apiRequest("PUT", "/api/prayer-settings", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prayer-settings'] });
      toast({
        title: "Settings updated",
        description: "Prayer time adjustments have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update settings: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const handleAdjustmentChange = (prayer: string, value: string) => {
    setPrayerAdjustments({
      ...prayerAdjustments,
      [prayer]: parseInt(value) || 0
    });
  };
  
  const handleSaveSettings = () => {
    if (!prayerSettings) return;
    
    updatePrayerSettingsMutation.mutate({
      ...prayerSettings,
      adjustments: prayerAdjustments
    });
  };
  
  // Calculate stats
  const activeEvents = events?.filter((e: any) => {
    const eventDate = new Date(e.date);
    const now = new Date();
    return eventDate >= now;
  }).length || 0;
  
  const upcomingEventsThisWeek = events?.filter((e: any) => {
    const eventDate = new Date(e.date);
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return eventDate >= now && eventDate <= nextWeek;
  }).length || 0;
  
  const totalDonations = donations?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0;
  
  const currentMonthDonations = donations?.filter((d: any) => {
    const donationDate = new Date(d.createdAt);
    const now = new Date();
    return donationDate.getMonth() === now.getMonth() && donationDate.getFullYear() === now.getFullYear();
  }).reduce((sum: number, d: any) => sum + d.amount, 0) || 0;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] bg-primary bg-opacity-10 rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary">Total Users</h3>
                <p className="text-3xl font-bold mt-2">245</p>
              </div>
              <div className="bg-primary bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center">
                <Users className="text-primary h-6 w-6" />
              </div>
            </div>
            <p className="text-sm mt-2 text-neutral-600">+12 this month</p>
          </div>
          
          <div className="flex-1 min-w-[200px] bg-primary-light bg-opacity-10 rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary-light">Active Events</h3>
                <p className="text-3xl font-bold mt-2">{activeEvents}</p>
              </div>
              <div className="bg-primary-light bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center">
                <Calendar className="text-primary-light h-6 w-6" />
              </div>
            </div>
            <p className="text-sm mt-2 text-neutral-600">{upcomingEventsThisWeek} upcoming this week</p>
          </div>
          
          <div className="flex-1 min-w-[200px] bg-primary-dark bg-opacity-10 rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary-dark">Donations</h3>
                <p className="text-3xl font-bold mt-2">Rp {(totalDonations / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-primary-dark bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center">
                <HeartHandshake className="text-primary-dark h-6 w-6" />
              </div>
            </div>
            <p className="text-sm mt-2 text-neutral-600">+Rp {(currentMonthDonations / 1000000).toFixed(1)}M this month</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-primary mb-4">Quick Actions</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/prayer-times">
                <a className="border border-neutral-200 rounded-lg p-4 text-center hover:border-primary hover:bg-primary hover:bg-opacity-5 transition">
                  <div className="bg-primary bg-opacity-10 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2">
                    <Clock className="text-primary h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium">Update Prayer Times</div>
                </a>
              </Link>
              
              <Link href="/events">
                <a className="border border-neutral-200 rounded-lg p-4 text-center hover:border-primary hover:bg-primary hover:bg-opacity-5 transition">
                  <div className="bg-primary bg-opacity-10 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2">
                    <Calendar className="text-primary h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium">Manage Events</div>
                </a>
              </Link>
              
              <Link href="/announcements">
                <a className="border border-neutral-200 rounded-lg p-4 text-center hover:border-primary hover:bg-primary hover:bg-opacity-5 transition">
                  <div className="bg-primary bg-opacity-10 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2">
                    <BellRing className="text-primary h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium">Post Announcement</div>
                </a>
              </Link>
              
              <Link href="/donations">
                <a className="border border-neutral-200 rounded-lg p-4 text-center hover:border-primary hover:bg-primary hover:bg-opacity-5 transition">
                  <div className="bg-primary bg-opacity-10 w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2">
                    <HeartHandshake className="text-primary h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium">Donation Reports</div>
                </a>
              </Link>
            </div>
            
            <h3 className="text-xl font-bold text-primary mt-6 mb-4">Recent Activity</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 pb-3 border-b border-neutral-200">
                <div className="bg-primary bg-opacity-10 rounded-full p-2 mt-1">
                  <Calendar className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">New Event Added</h4>
                  <p className="text-sm text-neutral-600">Community Iftar event was added to the calendar</p>
                  <p className="text-xs text-neutral-500 mt-1">2 hours ago by Admin</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 pb-3 border-b border-neutral-200">
                <div className="bg-primary bg-opacity-10 rounded-full p-2 mt-1">
                  <BellRing className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Announcement Published</h4>
                  <p className="text-sm text-neutral-600">Ramadan Prayer Schedule announcement was published</p>
                  <p className="text-xs text-neutral-500 mt-1">Yesterday by Imam</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary bg-opacity-10 rounded-full p-2 mt-1">
                  <Clock3 className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Prayer Times Updated</h4>
                  <p className="text-sm text-neutral-600">Prayer times for May 2023 were updated</p>
                  <p className="text-xs text-neutral-500 mt-1">2 days ago by Admin</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">System Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prayer Time Calculation Method</label>
                <Select defaultValue={prayerSettings?.method || "INDONESIA_MINISTRY_OF_RELIGIOUS_AFFAIRS"}>
                  <SelectTrigger className="w-full">
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
              
              <div>
                <label className="block text-sm font-medium mb-1">Default Latitude/Longitude</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="text" 
                    placeholder="Latitude" 
                    defaultValue={prayerSettings?.latitude || "-6.2088"}
                  />
                  <Input 
                    type="text" 
                    placeholder="Longitude" 
                    defaultValue={prayerSettings?.longitude || "106.8456"}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Timezone</label>
                <Select defaultValue={prayerSettings?.timezone || "Asia/Jakarta"}>
                  <SelectTrigger className="w-full">
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
                <label className="block text-sm font-medium mb-1">Prayer Time Adjustments (minutes)</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-xs mb-1">Fajr</div>
                    <Input 
                      type="number" 
                      value={prayerAdjustments.fajr} 
                      onChange={(e) => handleAdjustmentChange('fajr', e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="text-xs mb-1">Dhuhr</div>
                    <Input 
                      type="number" 
                      value={prayerAdjustments.dhuhr} 
                      onChange={(e) => handleAdjustmentChange('dhuhr', e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="text-xs mb-1">Asr</div>
                    <Input 
                      type="number" 
                      value={prayerAdjustments.asr} 
                      onChange={(e) => handleAdjustmentChange('asr', e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="text-xs mb-1">Maghrib</div>
                    <Input 
                      type="number" 
                      value={prayerAdjustments.maghrib} 
                      onChange={(e) => handleAdjustmentChange('maghrib', e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="text-xs mb-1">Isha</div>
                    <Input 
                      type="number" 
                      value={prayerAdjustments.isha} 
                      onChange={(e) => handleAdjustmentChange('isha', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  className="w-full bg-primary hover:bg-primary-dark"
                  onClick={handleSaveSettings}
                  disabled={updatePrayerSettingsMutation.isPending}
                >
                  {updatePrayerSettingsMutation.isPending ? (
                    <>
                      <Settings className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
