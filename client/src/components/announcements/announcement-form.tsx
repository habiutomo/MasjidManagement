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

interface AnnouncementFormProps {
  onSubmit: (data: any) => void;
  isPending: boolean;
}

// Form validation schema
const announcementFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  postedBy: z.string().min(1, "Author is required"),
  displayUntil: z.string().optional()
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export default function AnnouncementForm({ onSubmit, isPending }: AnnouncementFormProps) {
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      postedBy: "Admin",
      displayUntil: ""
    }
  });
  
  const handleSubmit = (values: AnnouncementFormValues) => {
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
              <FormLabel className="block text-sm font-medium mb-1">Title</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder="Announcement title"
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium mb-1">Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full p-2 border border-neutral-300 rounded-lg appearance-none focus:outline-none focus:border-primary">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Prayer">Prayer</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Donations">Donations</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium mb-1">Content</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  rows={5} 
                  placeholder="Announcement content"
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="displayUntil"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium mb-1">Display Until</FormLabel>
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
          name="postedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium mb-1">Posted By</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder="Author name"
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
              Posting Announcement...
            </>
          ) : "Post Announcement"}
        </Button>
      </form>
    </Form>
  );
}
