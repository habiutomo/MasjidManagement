import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface DonationTrackerProps {
  campaigns: any[];
}

export default function DonationTracker({ campaigns }: DonationTrackerProps) {
  // Get active campaigns
  const activeCampaigns = campaigns
    .filter(campaign => campaign.status === 'active')
    .sort((a, b) => b.collected / b.target - a.collected / a.target)
    .slice(0, 3);
  
  return (
    <Card className="bg-white rounded-xl shadow-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Donation Tracker</h2>
        
        {activeCampaigns.length > 0 ? (
          <div className="mb-4 space-y-4">
            {activeCampaigns.map(campaign => {
              const percentage = Math.min(Math.round((campaign.collected / campaign.target) * 100), 100);
              return (
                <div key={campaign.id} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{campaign.title}</span>
                    <span className="font-bold">{percentage}%</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2.5 bg-neutral-200" 
                    indicatorClassName={percentage === 100 ? "bg-[#43A047]" : ""}
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span>Target: Rp {campaign.target.toLocaleString()}</span>
                    <span>Collected: Rp {campaign.collected.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground mb-4">No active donation campaigns.</p>
        )}
        
        <div className="mt-4">
          <Link href="/donations">
            <Button className="bg-primary hover:bg-primary-dark text-white w-full">
              Make a Donation
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
