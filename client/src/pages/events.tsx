import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import EventCalendar from "@/components/events/event-calendar";
import EventForm from "@/components/events/event-form";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function Events() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  
  const { data: events, isLoading } = useQuery({
    queryKey: ['/api/events'],
  });
  
  const createEventMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await apiRequest("POST", "/api/events", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create event: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
    }
  };
  
  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    }
  };
  
  const handleAddEvent = (formData: any) => {
    createEventMutation.mutate(formData);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Event Calendar</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Button 
              variant={view === 'month' ? 'default' : 'outline'} 
              onClick={() => setView('month')}
              className={view === 'month' ? 'bg-primary text-white' : 'text-primary hover:bg-primary-light hover:text-white'}
            >
              Month
            </Button>
            <Button 
              variant={view === 'week' ? 'default' : 'outline'} 
              onClick={() => setView('week')}
              className={view === 'week' ? 'bg-primary text-white' : 'text-primary hover:bg-primary-light hover:text-white'}
            >
              Week
            </Button>
            <Button 
              variant={view === 'day' ? 'default' : 'outline'} 
              onClick={() => setView('day')}
              className={view === 'day' ? 'bg-primary text-white' : 'text-primary hover:bg-primary-light hover:text-white'}
            >
              Day
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handlePrevious} size="icon">
              <ChevronLeft className="h-4 w-4 text-primary" />
            </Button>
            <h3 className="text-lg font-bold">{format(currentDate, 'MMMM yyyy')}</h3>
            <Button variant="ghost" onClick={handleNext} size="icon">
              <ChevronRight className="h-4 w-4 text-primary" />
            </Button>
          </div>
        </div>
        
        <EventCalendar 
          events={events || []} 
          currentDate={currentDate} 
          view={view}
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Upcoming Events</h3>
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Calendar className="mr-2 h-4 w-4 animate-spin" />
              <p>Loading events...</p>
            </div>
          ) : events && events.length > 0 ? (
            <div className="space-y-4">
              {events.slice(0, 3).map((event: any) => (
                <div key={event.id} className={`border-l-4 border-primary p-4 bg-neutral-50 rounded-r-lg
                  ${event.eventType === 'Study' ? 'border-primary-light' : ''}
                  ${event.eventType === 'Community' ? 'border-primary-dark' : ''}
                `}>
                  <div className="flex justify-between">
                    <h3 className="font-bold">{event.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded text-white
                      ${event.eventType === 'Jumu\'ah' ? 'bg-primary' : ''}
                      ${event.eventType === 'Study' ? 'bg-primary-light' : ''}
                      ${event.eventType === 'Community' ? 'bg-primary-dark' : ''}
                    `}>
                      {event.eventType}
                    </span>
                  </div>
                  <p className="text-sm opacity-75">{event.description}</p>
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center text-xs">
                      <Calendar className="text-primary mr-1 h-3 w-3" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="material-icons text-primary text-sm mr-1">schedule</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No upcoming events found.</p>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Add New Event</h3>
          <EventForm onSubmit={handleAddEvent} isPending={createEventMutation.isPending} />
        </div>
      </div>
    </div>
  );
}
