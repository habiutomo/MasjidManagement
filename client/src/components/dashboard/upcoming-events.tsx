import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface UpcomingEventsProps {
  events: any[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  const upcomingEvents = sortedEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= new Date();
  }).slice(0, 3);
  
  return (
    <Card className="bg-white rounded-xl shadow-md mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">Upcoming Events</h2>
          <Link href="/events">
            <a className="text-primary hover:text-primary-dark transition">View All</a>
          </Link>
        </div>
        
        <div className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className={`border-l-4 p-4 bg-neutral-50 rounded-r-lg ${
                  event.eventType === 'Jumu\'ah' ? 'border-primary' :
                  event.eventType === 'Study' ? 'border-primary-light' :
                  'border-primary-dark'
                }`}
              >
                <div className="flex justify-between">
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <span className={`text-sm px-2 py-1 rounded text-white ${
                    event.eventType === 'Jumu\'ah' ? 'bg-primary' :
                    event.eventType === 'Study' ? 'bg-primary-light' :
                    'bg-primary-dark'
                  }`}>
                    {event.eventType}
                  </span>
                </div>
                <p className="text-sm opacity-75">{event.description}</p>
                <div className="flex justify-between mt-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="text-primary mr-1 h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="text-primary mr-1 h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">No upcoming events found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
