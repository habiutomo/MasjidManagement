import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import DonationCampaigns from "@/components/donations/donation-campaigns";
import DonationForm from "@/components/donations/donation-form";
import DonationList from "@/components/donations/donation-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function Donations() {
  const { toast } = useToast();
  
  const { data: campaigns, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['/api/campaigns'],
  });
  
  const { data: donations, isLoading: isLoadingDonations } = useQuery({
    queryKey: ['/api/donations'],
  });
  
  const createDonationMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await apiRequest("POST", "/api/donations", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      toast({
        title: "Donation successful",
        description: "Thank you for your donation!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to process donation: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  const handleDonate = (formData: any) => {
    createDonationMutation.mutate(formData);
  };
  
  // Calculations for donation summary
  const activeCampaigns = campaigns?.filter((c: any) => c.status === 'active') || [];
  const completedCampaigns = campaigns?.filter((c: any) => c.status === 'completed') || [];
  
  const currentMonthDonations = donations?.filter((d: any) => {
    const donationDate = new Date(d.createdAt);
    const now = new Date();
    return donationDate.getMonth() === now.getMonth() && donationDate.getFullYear() === now.getFullYear();
  }) || [];
  
  const totalMonthlyDonations = currentMonthDonations.reduce((sum: number, d: any) => sum + d.amount, 0);
  const uniqueDonorsThisMonth = [...new Set(currentMonthDonations.map((d: any) => d.donor))].length;
  
  // Calculate donation allocation by campaign type
  const campaignTypes = {
    infrastructure: 0,
    charity: 0,
    education: 0
  };
  
  if (campaigns) {
    const infrastructureCampaigns = campaigns.filter((c: any) => 
      c.title.includes('Air Conditioning') || c.title.includes('Renovation')
    );
    const charityCampaigns = campaigns.filter((c: any) => 
      c.title.includes('Food') || c.title.includes('Donation')
    );
    const educationCampaigns = campaigns.filter((c: any) => 
      c.title.includes('Library') || c.title.includes('Education')
    );
    
    const totalCollected = campaigns.reduce((sum: number, c: any) => sum + c.collected, 0);
    
    if (totalCollected > 0) {
      campaignTypes.infrastructure = Math.round(infrastructureCampaigns.reduce((sum: number, c: any) => sum + c.collected, 0) / totalCollected * 100);
      campaignTypes.charity = Math.round(charityCampaigns.reduce((sum: number, c: any) => sum + c.collected, 0) / totalCollected * 100);
      campaignTypes.education = Math.round(educationCampaigns.reduce((sum: number, c: any) => sum + c.collected, 0) / totalCollected * 100);
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Donations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-primary mb-4">Current Campaigns</h3>
            
            {isLoadingCampaigns ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <p>Loading campaigns...</p>
              </div>
            ) : (
              <DonationCampaigns campaigns={campaigns || []} />
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-primary mb-4">Recent Donations</h3>
            
            {isLoadingDonations ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <p>Loading donations...</p>
              </div>
            ) : (
              <DonationList donations={donations || []} />
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-primary mb-4">Make a Donation</h3>
            <DonationForm 
              campaigns={activeCampaigns} 
              onSubmit={handleDonate} 
              isPending={createDonationMutation.isPending}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-primary mb-4">Donation Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Donations This Month</span>
                <span className="font-bold">Rp {totalMonthlyDonations.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Total Donors This Month</span>
                <span className="font-bold">{uniqueDonorsThisMonth}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Active Campaigns</span>
                <span className="font-bold">{activeCampaigns.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Completed Campaigns</span>
                <span className="font-bold">{completedCampaigns.length}</span>
              </div>
            </div>
            
            <hr className="my-4 border-neutral-200" />
            
            <div>
              <h4 className="font-medium mb-2">Donation Allocation</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Infrastructure</span>
                    <span>{campaignTypes.infrastructure}%</span>
                  </div>
                  <Progress value={campaignTypes.infrastructure} className="h-1.5 bg-neutral-200" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Charity</span>
                    <span>{campaignTypes.charity}%</span>
                  </div>
                  <Progress value={campaignTypes.charity} className="h-1.5 bg-neutral-200" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Education</span>
                    <span>{campaignTypes.education}%</span>
                  </div>
                  <Progress value={campaignTypes.education} className="h-1.5 bg-neutral-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
