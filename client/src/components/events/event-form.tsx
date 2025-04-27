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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface EventFormProps {
  onSubmit: (data: any) => void;
  isPending: boolean;
}

// Form validation schema
const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  eventType: z.string().min(1, "Please select an event type"),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional()
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function EventForm({ onSubmit, isPending }: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      eventType: "",
      date: "",
      time: ""
    }
  });
  
  const handleSubmit = (values: EventFormValues) => {
    onSubmit(values);
    form.reset();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium mb-1">Event Title</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder="Enter event title"
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium mb-1">Event Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full p-2 border border-neutral-300 rounded-lg appearance-none focus:outline-none focus:border-primary">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Jumu'ah">Prayer</SelectItem>
                  <SelectItem value="Study">Study</SelectItem>
                  <SelectItem value="Community">Community</SelectItem>
                  <SelectItem value="Charity">Charity</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium mb-1">Date</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type="date" 
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium mb-1">Time</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type="time" 
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium mb-1">Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  rows={3} 
                  placeholder="Enter event description"
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Event...
            </>
          ) : "Add Event"}
        </Button>
      </form>
    </Form>
  );
}
