import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, addMonths, subMonths } from "date-fns";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PrayerSettings from "@/components/prayer/prayer-settings";
import PrayerTable from "@/components/prayer/prayer-table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { calculateMonthlyPrayerTimes } from "@/lib/prayer-times";

export default function PrayerTimes() {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['/api/prayer-settings'],
  });
  
  const updateSettingsMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await apiRequest("PUT", "/api/prayer-settings", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prayer-settings'] });
      toast({
        title: "Settings updated",
        description: "Prayer calculation settings have been updated successfully.",
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
  
  const handleUpdateSettings = (formData: any) => {
    updateSettingsMutation.mutate(formData);
  };
  
  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prayerTimes = settings ? calculateMonthlyPrayerTimes(
    currentMonth,
    settings.latitude,
    settings.longitude,
    settings.method,
    settings.adjustments
  ) : [];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Prayer Times</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <PrayerSettings 
          settings={settings} 
          isLoading={isLoadingSettings}
          onSubmit={handleUpdateSettings}
          isPending={updateSettingsMutation.isPending}
        />
      </div>
      
      <div className="overflow-x-auto bg-white rounded-xl shadow-md mb-4">
        <PrayerTable prayerTimes={prayerTimes} />
      </div>
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          className="text-primary hover:text-primary-dark flex items-center"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Previous Month</span>
        </Button>
        
        <span className="py-2 px-4 font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        
        <Button 
          variant="outline" 
          className="text-primary hover:text-primary-dark flex items-center"
          onClick={handleNextMonth}
        >
          <span>Next Month</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
