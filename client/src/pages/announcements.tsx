import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AnnouncementList from "@/components/announcements/announcement-list";
import AnnouncementForm from "@/components/announcements/announcement-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Announcements() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['/api/announcements'],
  });
  
  const createAnnouncementMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await apiRequest("POST", "/api/announcements", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({
        title: "Announcement created",
        description: "Your announcement has been posted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create announcement: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const handleCreateAnnouncement = (formData: any) => {
    createAnnouncementMutation.mutate(formData);
  };
  
  const filteredAnnouncements = selectedCategory === "All Categories"
    ? announcements
    : announcements?.filter((announcement: any) => announcement.category === selectedCategory);
  
  const categories = announcements
    ? [...new Set(announcements.map((a: any) => a.category))]
    : [];
  
  const categoryCounts = categories.reduce((acc: Record<string, number>, category: string) => {
    acc[category] = announcements.filter((a: any) => a.category === category).length;
    return acc;
  }, {});
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Announcements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary">Recent Announcements</h3>
                <div>
                  <select 
                    className="border border-neutral-300 rounded-lg p-1 focus:outline-none focus:border-primary text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option>All Categories</option>
                    {categories.map((category: string) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <p>Loading announcements...</p>
                </div>
              ) : (
                <AnnouncementList 
                  announcements={filteredAnnouncements || []} 
                  currentPage={currentPage} 
                />
              )}
            </div>
            
            {filteredAnnouncements && filteredAnnouncements.length > 0 && (
              <div className="flex justify-center">
                <div className="inline-flex rounded-md">
                  <Button 
                    variant={currentPage === 1 ? "default" : "outline"}
                    className={currentPage === 1 ? "bg-primary text-white" : "hover:bg-neutral-100"}
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </Button>
                  {filteredAnnouncements.length > 3 && (
                    <Button 
                      variant={currentPage === 2 ? "default" : "outline"}
                      className={currentPage === 2 ? "bg-primary text-white" : "hover:bg-neutral-100"}
                      onClick={() => setCurrentPage(2)}
                    >
                      2
                    </Button>
                  )}
                  {filteredAnnouncements.length > 6 && (
                    <Button 
                      variant={currentPage === 3 ? "default" : "outline"}
                      className={currentPage === 3 ? "bg-primary text-white" : "hover:bg-neutral-100"}
                      onClick={() => setCurrentPage(3)}
                    >
                      3
                    </Button>
                  )}
                  {currentPage < Math.ceil(filteredAnnouncements.length / 3) && (
                    <Button 
                      variant="outline" 
                      className="hover:bg-neutral-100"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-primary mb-4">Add Announcement</h3>
            <AnnouncementForm 
              onSubmit={handleCreateAnnouncement} 
              isPending={createAnnouncementMutation.isPending} 
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-primary mb-4">Announcement Categories</h3>
            
            <div className="space-y-2">
              {categories.map((category: string) => (
                <div 
                  key={category}
                  className="flex justify-between items-center p-2 hover:bg-neutral-50 rounded-lg cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      category === "Prayer" ? "bg-primary" :
                      category === "Events" ? "bg-primary-light" :
                      category === "Donations" ? "bg-primary-dark" : "bg-neutral-500"
                    }`}></div>
                    <span>{category}</span>
                  </div>
                  <span className="bg-neutral-200 text-neutral-700 text-xs px-2 py-1 rounded-full">
                    {categoryCounts[category]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
