import { formatDistanceToNow } from "date-fns";
import { User, Clock } from "lucide-react";

interface AnnouncementListProps {
  announcements: any[];
  currentPage: number;
}

export default function AnnouncementList({ announcements, currentPage }: AnnouncementListProps) {
  // Sort announcements by creation date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  // Paginate announcements - 3 per page
  const paginatedAnnouncements = sortedAnnouncements.slice((currentPage - 1) * 3, currentPage * 3);
  
  if (announcements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No announcements found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {paginatedAnnouncements.map((announcement, index) => (
        <div 
          key={announcement.id} 
          className={index < paginatedAnnouncements.length - 1 ? "border-b border-neutral-200 pb-6" : "pb-6"}
        >
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-bold">{announcement.title}</h4>
            <span className={`text-xs text-white px-2 py-1 rounded ${
              announcement.category === 'Prayer' ? 'bg-primary-light' :
              announcement.category === 'Events' ? 'bg-primary' :
              announcement.category === 'Donations' ? 'bg-primary-dark' : 'bg-neutral-500'
            }`}>
              {announcement.category}
            </span>
          </div>
          <p className="my-2">{announcement.content}</p>
          <div className="flex justify-between items-center text-sm text-neutral-500">
            <div className="flex items-center">
              <User className="text-primary mr-1 h-4 w-4" />
              <span>Posted by {announcement.postedBy}</span>
            </div>
            <div className="flex items-center">
              <Clock className="text-primary mr-1 h-4 w-4" />
              <span>
                Posted {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          {announcement.displayUntil && (
            <div className="mt-2 text-xs text-primary">
              Display until: {announcement.displayUntil}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
