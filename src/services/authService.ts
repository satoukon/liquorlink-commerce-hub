
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";

// Create an admin user by email (can only be called by existing admins)
export const makeUserAdmin = async (userEmail: string): Promise<boolean> => {
  try {
    // First try to find the user by email
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", userEmail)
      .single();
    
    if (userError) {
      console.error("Error finding user:", userError);
      return false;
    }
    
    if (!user) {
      console.error("User not found");
      return false;
    }
    
    // Update the user's profile to make them an admin
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: true })
      .eq("id", user.id);
    
    if (error) {
      console.error("Error making user admin:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in makeUserAdmin:", error);
    return false;
  }
};

// Get all users with their profiles (admin only)
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
    
    return data as UserProfile[];
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return [];
  }
};
