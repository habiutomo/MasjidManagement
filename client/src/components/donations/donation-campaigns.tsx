import { format, isAfter, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, BadgeCheck } from "lucide-react";

interface DonationCampaignsProps {
  campaigns: any[];
}

export default function DonationCampaigns({ campaigns }: DonationCampaignsProps) {
  // Sort campaigns by status (active first) then by percentage collected (highest first)
  const sortedCampaigns = [...campaigns].sort((a, b) => {
    // Active campaigns first
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    
    // Then by percentage collected
    const percentageA = (a.collected / a.target) * 100;
    const percentageB = (b.collected / b.target) * 100;
    return percentageB - percentageA;
  });
  
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No donation campaigns found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {sortedCampaigns.map((campaign) => {
        const percentage = Math.min(Math.round((campaign.collected / campaign.target) * 100), 100);
        const isActive = campaign.status === 'active';
        
        // Calculate days remaining if campaign is active and has an end date
        let daysRemaining = null;
        if (isActive && campaign.endDate) {
          const endDate = parseISO(campaign.endDate);
          const today = new Date();
          
          if (isAfter(endDate, today)) {
            const diffTime = Math.abs(endDate.getTime() - today.getTime());
            daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
        }
        
        return (
          <div key={campaign.id} className="border border-neutral-200 rounded-lg p-4">
            <h4 className="text-lg font-bold">{campaign.title}</h4>
            <p className="text-sm my-2">{campaign.description}</p>
            
            <div className="my-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span className="font-bold">{percentage}%</span>
              </div>
              <Progress 
                value={percentage} 
                className="w-full bg-neutral-200 rounded-full h-2.5"
                indicatorClassName={percentage === 100 ? "bg-[#43A047]" : undefined}
              />
              <div className="flex justify-between text-xs mt-1">
                <span>Target: Rp {campaign.target.toLocaleString()}</span>
                <span>Collected: Rp {campaign.collected.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              {isActive ? (
                daysRemaining ? (
                  <span className="text-xs text-neutral-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {daysRemaining} days remaining
                  </span>
                ) : (
                  <span className="text-xs text-neutral-500">Ongoing campaign</span>
                )
              ) : (
                <span className="text-xs text-[#43A047] flex items-center">
                  <BadgeCheck className="h-3 w-3 mr-1" />
                  Target reached! Thank you!
                </span>
              )}
              
              {isActive ? (
                <Button 
                  size="sm"
                  className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-lg transition text-sm"
                  onClick={() => window.location.href = "#donation-form"}
                >
                  Donate Now
                </Button>
              ) : (
                <Button 
                  size="sm"
                  className="bg-[#43A047] text-white px-3 py-1 rounded-lg text-sm"
                  disabled
                >
                  Completed
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
