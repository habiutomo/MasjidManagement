import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface AnnouncementsPreviewProps {
  announcements: any[];
}

export default function AnnouncementsPreview({ announcements }: AnnouncementsPreviewProps) {
  // Sort announcements by creation date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }).slice(0, 3);
  
  return (
    <Card className="bg-white rounded-xl shadow-md mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">Announcements</h2>
          <Link href="/announcements">
            <a className="text-primary hover:text-primary-dark transition">View All</a>
          </Link>
        </div>
        
        <div className="space-y-4">
          {sortedAnnouncements.length > 0 ? (
            sortedAnnouncements.map((announcement, index) => (
              <div 
                key={announcement.id} 
                className={index < sortedAnnouncements.length - 1 ? "border-b border-neutral-200 pb-3" : "pb-3"}
              >
                <h3 className="font-bold">{announcement.title}</h3>
                <p className="text-sm">{announcement.content.length > 100 ? `${announcement.content.substring(0, 97)}...` : announcement.content}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-neutral-500">
                    Posted {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                  </span>
                  <span className="text-xs text-primary">{announcement.postedBy}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">No announcements found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
