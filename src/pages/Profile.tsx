
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Validation schema for profile form
const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" })
    .optional(),
  avatar_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
});

const Profile = () => {
  const { authState, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authState.isLoading && !authState.user) {
      navigate("/auth");
    }
  }, [authState, navigate]);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: authState.profile?.username || "",
      avatar_url: authState.profile?.avatar_url || "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        username: values.username || null,
        avatar_url: values.avatar_url || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authState.isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={authState.profile?.avatar_url || ""} />
                  <AvatarFallback>
                    {authState.profile?.username?.substring(0, 2).toUpperCase() || 
                     authState.user?.email?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>
                    {authState.profile?.username || authState.user?.email}
                    {authState.isAdmin && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                        Admin
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Your username" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/avatar.png" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {authState.isAdmin && (
                    <div className="p-4 bg-muted rounded-md">
                      <h3 className="font-medium mb-2">Admin Access</h3>
                      <p className="text-sm text-muted-foreground">
                        You have admin access to the system. Visit the admin dashboard to manage products, orders, and users.
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => navigate("/inventory")}
                      >
                        Go to Admin Dashboard
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
