import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface DonationFormProps {
  campaigns: any[];
  onSubmit: (data: any) => void;
  isPending: boolean;
}

// Form validation schema
const donationFormSchema = z.object({
  campaignId: z.string().min(1, "Please select a campaign"),
  donor: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  isAnonymous: z.boolean().default(false),
  paymentMethod: z.string().min(1, "Please select a payment method"),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

export default function DonationForm({ campaigns, onSubmit, isPending }: DonationFormProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Bank Transfer");
  
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      campaignId: "",
      donor: "",
      amount: "",
      isAnonymous: false,
      paymentMethod: "Bank Transfer",
    }
  });
  
  const handleSubmit = (values: DonationFormValues) => {
    // Convert campaignId from string to number
    const formattedValues = {
      ...values,
      campaignId: parseInt(values.campaignId),
      amount: parseInt(values.amount.replace(/[^\d]/g, '')),
    };
    
    onSubmit(formattedValues);
    form.reset();
  };
  
  // Format amount with thousands separator
  const formatAmount = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/[^\d]/g, '');
    
    // Format with thousands separator
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Handle amount change with formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatAmount(value);
    form.setValue("amount", formatted);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="campaignId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium mb-1">Campaign</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full p-2 border border-neutral-300 rounded-lg appearance-none focus:outline-none focus:border-primary">
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id.toString()}>
                      {campaign.title}
                    </SelectItem>
                  ))}
                  <SelectItem value="general">General Donation</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium mb-1">Amount (Rp)</FormLabel>
              <FormControl>
                <Input 
                  {...fieldProps}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="donor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium mb-1">Donor Name</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder="Enter your name (optional)"
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
                  disabled={form.watch("isAnonymous")}
                />
              </FormControl>
              <div className="flex items-center mt-1">
                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="anonymous"
                        />
                      </FormControl>
                      <FormLabel htmlFor="anonymous" className="text-sm">
                        Donate anonymously
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium mb-1">Payment Method</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  type="button"
                  variant="outline"
                  className={`border rounded-lg p-2 text-center cursor-pointer ${
                    field.value === "Bank Transfer" ? "border-primary bg-primary bg-opacity-10" : "border-neutral-300 hover:border-primary hover:bg-primary hover:bg-opacity-10"
                  }`}
                  onClick={() => {
                    setSelectedPaymentMethod("Bank Transfer");
                    field.onChange("Bank Transfer");
                  }}
                >
                  <div className="text-sm font-medium">Bank Transfer</div>
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className={`border rounded-lg p-2 text-center cursor-pointer ${
                    field.value === "E-wallet" ? "border-primary bg-primary bg-opacity-10" : "border-neutral-300 hover:border-primary hover:bg-primary hover:bg-opacity-10"
                  }`}
                  onClick={() => {
                    setSelectedPaymentMethod("E-wallet");
                    field.onChange("E-wallet");
                  }}
                >
                  <div className="text-sm font-medium">E-wallet</div>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition w-full"
          disabled={isPending}
          id="donation-form"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Donation...
            </>
          ) : "Proceed to Payment"}
        </Button>
      </form>
    </Form>
  );
}
