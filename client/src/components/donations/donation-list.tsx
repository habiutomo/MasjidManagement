import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DonationListProps {
  donations: any[];
}

export default function DonationList({ donations }: DonationListProps) {
  // Sort donations by date (newest first)
  const sortedDonations = [...donations].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  if (donations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No donations recorded yet.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-100">
            <TableHead className="py-2 px-4 text-left">Date</TableHead>
            <TableHead className="py-2 px-4 text-left">Donor</TableHead>
            <TableHead className="py-2 px-4 text-left">Campaign</TableHead>
            <TableHead className="py-2 px-4 text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDonations.slice(0, 5).map((donation) => (
            <TableRow key={donation.id} className="border-b border-neutral-200">
              <TableCell className="py-2 px-4">
                {format(new Date(donation.createdAt), 'dd MMM yyyy')}
              </TableCell>
              <TableCell className="py-2 px-4">
                {donation.isAnonymous ? "Anonymous" : donation.donor || "Anonymous"}
              </TableCell>
              <TableCell className="py-2 px-4">
                {donation.campaignId === 1 ? "Air Conditioning System" : 
                 donation.campaignId === 2 ? "Ramadan Food Packages" :
                 donation.campaignId === 3 ? "Library Renovation" : "General Donation"}
              </TableCell>
              <TableCell className="py-2 px-4 text-right">
                Rp {donation.amount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
