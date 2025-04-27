import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CurrentPrayer from "@/components/dashboard/current-prayer";
import MasjidGallery from "@/components/dashboard/masjid-gallery";
import UpcomingEvents from "@/components/dashboard/upcoming-events";
import TodaysPrayers from "@/components/dashboard/todays-prayers";
import AnnouncementsPreview from "@/components/dashboard/announcements-preview";
import DonationTracker from "@/components/dashboard/donation-tracker";

export default function Home() {
  const { data: prayerSettings } = useQuery({
    queryKey: ['/api/prayer-settings'],
  });

  const { data: events } = useQuery({
    queryKey: ['/api/events'],
  });

  const { data: announcements } = useQuery({
    queryKey: ['/api/announcements'],
  });

  const { data: campaigns } = useQuery({
    queryKey: ['/api/campaigns'],
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2">
          <CurrentPrayer settings={prayerSettings} />
          <MasjidGallery />
          <UpcomingEvents events={events || []} />
        </div>
        
        {/* Right Column */}
        <div>
          <TodaysPrayers settings={prayerSettings} />
          <AnnouncementsPreview announcements={announcements || []} />
          <DonationTracker campaigns={campaigns || []} />
        </div>
      </div>
    </div>
  );
}
