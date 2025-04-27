import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays,
  parse,
  getDay
} from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

interface EventCalendarProps {
  events: any[];
  currentDate: Date;
  view: 'month' | 'week' | 'day';
  isLoading: boolean;
}

export default function EventCalendar({ 
  events, 
  currentDate, 
  view, 
  isLoading 
}: EventCalendarProps) {
  // Helper function to get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = parse(event.date, 'yyyy-MM-dd', new Date());
      return isSameDay(eventDate, date);
    });
  };
  
  // Month view
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const dateFormat = "d";
    const rows = [];
    
    let days = [];
    let day = startDate;
    let formattedDate = "";
    
    // Header with day names
    const weekDays = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    for (let i = 0; i < 7; i++) {
      weekDays.push(
        <div key={`header-${i}`} className="text-center font-medium p-2">
          {dayNames[i]}
        </div>
      );
    }
    
    rows.push(
      <div key="header" className="grid grid-cols-7 gap-1">
        {weekDays}
      </div>
    );
    
    // Calendar days
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dayEvents = getEventsForDay(day);
        
        days.push(
          <div 
            key={day.toString()}
            className={`border rounded-lg p-2 hover:border-primary hover:bg-neutral-50 cursor-pointer min-h-[100px] ${
              !isSameMonth(day, monthStart) ? "text-neutral-400" : 
              isSameDay(day, new Date()) ? "bg-primary bg-opacity-10 border-primary" : ""
            }`}
          >
            <div className={`text-right ${
              isSameDay(day, new Date()) ? "font-bold" : ""
            }`}>
              {formattedDate}
            </div>
            <div className="mt-2 text-xs">
              {isLoading ? (
                <Skeleton className="h-4 w-full mb-1" />
              ) : (
                dayEvents.map(event => (
                  <div 
                    key={event.id}
                    className={`text-white text-xs p-1 rounded mb-1 ${
                      event.eventType === 'Jumu\'ah' ? 'bg-primary' :
                      event.eventType === 'Study' ? 'bg-primary-light' :
                      event.eventType === 'Community' ? 'bg-primary-dark' : 'bg-primary'
                    }`}
                  >
                    {event.title}
                  </div>
                ))
              )}
            </div>
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      
      days = [];
    }
    
    return <div className="space-y-1">{rows}</div>;
  };
  
  // Week view
  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const days = [];
    let day = startDate;
    
    while (day <= endDate) {
      const dayEvents = getEventsForDay(day);
      
      days.push(
        <div 
          key={day.toString()}
          className={`border rounded-lg p-4 hover:border-primary hover:bg-neutral-50 cursor-pointer ${
            isSameDay(day, new Date()) ? "bg-primary bg-opacity-10 border-primary" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold">{format(day, 'EEEE')}</div>
            <div className={`${isSameDay(day, new Date()) ? "font-bold" : ""}`}>
              {format(day, 'd MMM')}
            </div>
          </div>
          
          <div className="space-y-2">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-full mb-1" />
                <Skeleton className="h-5 w-full mb-1" />
              </>
            ) : dayEvents.length > 0 ? (
              dayEvents.map(event => (
                <div 
                  key={event.id}
                  className={`p-2 rounded text-white text-sm ${
                    event.eventType === 'Jumu\'ah' ? 'bg-primary' :
                    event.eventType === 'Study' ? 'bg-primary-light' :
                    event.eventType === 'Community' ? 'bg-primary-dark' : 'bg-primary'
                  }`}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-xs flex justify-between">
                    <span>{event.eventType}</span>
                    <span>{event.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground py-2">
                No events
              </div>
            )}
          </div>
        </div>
      );
      
      day = addDays(day, 1);
    }
    
    return <div className="grid grid-cols-1 md:grid-cols-7 gap-2">{days}</div>;
  };
  
  // Day view
  const renderDayView = () => {
    const dayEvents = getEventsForDay(currentDate);
    
    return (
      <div className="border rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="font-bold text-xl">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h3>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
            </>
          ) : dayEvents.length > 0 ? (
            dayEvents.map(event => (
              <div 
                key={event.id}
                className={`p-4 rounded-lg ${
                  event.eventType === 'Jumu\'ah' ? 'border-l-4 border-primary bg-primary bg-opacity-5' :
                  event.eventType === 'Study' ? 'border-l-4 border-primary-light bg-primary-light bg-opacity-5' :
                  event.eventType === 'Community' ? 'border-l-4 border-primary-dark bg-primary-dark bg-opacity-5' : 
                  'border-l-4 border-primary bg-primary bg-opacity-5'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{event.title}</h4>
                    <p className="text-sm opacity-75">{event.description}</p>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded text-white ${
                      event.eventType === 'Jumu\'ah' ? 'bg-primary' :
                      event.eventType === 'Study' ? 'bg-primary-light' :
                      event.eventType === 'Community' ? 'bg-primary-dark' : 'bg-primary'
                    }`}>
                      {event.eventType}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-1">schedule</span>
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-3 text-primary opacity-20" />
              <p className="text-lg font-medium">No events scheduled for this day</p>
              <p className="text-sm">Add an event using the form below</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Calendar className="mr-2 h-5 w-5 animate-spin text-primary" />
        <p>Loading events calendar...</p>
      </div>
    );
  }
  
  if (view === 'month') {
    return renderMonthView();
  } else if (view === 'week') {
    return renderWeekView();
  } else {
    return renderDayView();
  }
}
