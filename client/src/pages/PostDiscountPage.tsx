import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/use-categories";
import { Loader2, Upload, Plus, X, Globe, Youtube, MapPin, Phone } from "lucide-react";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().min(1, "Original price is required"),
  discountPrice: z.string().min(1, "Discount price is required"),
  categoryId: z.string().min(1, "Category is required"),
  merchantName: z.string().min(2, "Merchant name is required"),
  imageUrl: z.string().url("Please enter a valid cover image URL"),
  additionalImages: z.array(z.object({ url: z.string().url("Invalid URL") })).max(4),
  isFirstTimer: z.boolean().default(false),
  location: z.string().optional(),
  contact: z.string().optional(),
  directLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  youtubeLink: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export default function PostDiscountPage() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: categories } = useCategories();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      discountPrice: "",
      categoryId: "",
      merchantName: "",
      imageUrl: "",
      additionalImages: [],
      isFirstTimer: false,
      location: "",
      contact: "",
      directLink: "",
      youtubeLink: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalImages",
  });

  const watchCoverImage = form.watch("imageUrl");
  const watchIsFirstTimer = form.watch("isFirstTimer");

  async function onSubmit(values: z.infer<typeof postSchema>) {
    setIsLoading(true);
    // Mock successful post
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Discount Posted!",
        description: "Your deal has been submitted successfully and is now live.",
      });
      setLocation("/discounts");
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full p-0 sm:p-4 py-12">
        <Card className="shadow-2xl border-primary/10 rounded-none sm:rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-display font-black text-primary">Post a New Discount</CardTitle>
            <CardDescription>Share an amazing deal with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Deal Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 50% Off Summer Collection" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="merchantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Merchant Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Fashion Hub" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-muted/30 p-6 rounded-2xl border border-border space-y-6">
                    <h3 className="font-bold flex items-center gap-2">
                      <Upload className="w-4 h-4 text-primary" /> Media Assets
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Cover Image URL</FormLabel>
                            <div className="space-y-4">
                              <FormControl>
                                <Input placeholder="https://images.unsplash.com/..." {...field} />
                              </FormControl>
                              {watchCoverImage && (
                                <div className="relative aspect-video rounded-xl overflow-hidden border bg-background group">
                                  <img src={watchCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">Cover Image Preview</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="md:col-span-2 space-y-4">
                        <FormLabel>Additional Ad Images (Max 4)</FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {fields.map((field, index) => (
                            <div key={field.id} className="relative group aspect-square rounded-xl overflow-hidden border bg-background">
                              <FormField
                                control={form.control}
                                name={`additionalImages.${index}.url`}
                                render={({ field: inputField }) => (
                                  <>
                                    <input type="hidden" {...inputField} />
                                    {inputField.value && (
                                      <img src={inputField.value} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </>
                                )}
                              />
                            </div>
                          ))}
                          {fields.length < 4 && (
                            <Button
                              type="button"
                              variant="outline"
                              className="aspect-square h-full border-dashed rounded-xl flex flex-col gap-2"
                              onClick={() => {
                                const url = prompt("Enter additional image URL:");
                                if (url) append({ url });
                              }}
                            >
                              <Plus className="w-6 h-6" />
                              <span className="text-xs">Add Image</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Original Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="99.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="49.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="directLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Globe className="w-4 h-4" /> Online Direct Link (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://store.com/item" {...field} />
                          </FormControl>
                          <FormDescription>If the discount is available online</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="youtubeLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Youtube className="w-4 h-4" /> YouTube Ad Video (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                          </FormControl>
                          <FormDescription>Link to an ad video for this deal</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-6">
                    <FormField
                      control={form.control}
                      name="isFirstTimer"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-bold">First Time Merchant?</FormLabel>
                            <FormDescription>Toggle if you are posting for the first time</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {watchIsFirstTimer && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t animate-in fade-in slide-in-from-top-4">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Merchant Location
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Accra, Ghana" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Contact Number
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="+233 24 000 0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the deal in detail..." 
                            className="min-h-[120px] resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full h-14 text-lg font-bold rounded-full shadow-xl shadow-primary/20" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Posting...</>
                  ) : (
                    <><Upload className="mr-2 h-5 w-5" /> Post Discount Ad</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
