
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { AuthState, UserProfile } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isAdmin: false,
};

export const AuthContext = createContext<{
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile | null>;
}>({
  authState: initialState,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const { toast } = useToast();

  // Clean up any stale auth state
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          // Update session and user synchronously
          setAuthState((current) => ({
            ...current,
            session,
            user: session?.user || null,
          }));
          
          // Defer profile fetching
          if (session?.user) {
            setTimeout(async () => {
              const profile = await fetchUserProfile(session.user.id);
              setAuthState((current) => ({
                ...current,
                profile,
                isLoading: false,
                isAdmin: !!profile?.is_admin,
              }));
            }, 0);
          } else {
            setAuthState((current) => ({
              ...current,
              profile: null,
              isLoading: false,
              isAdmin: false,
            }));
          }
        }
      );

      // THEN check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setAuthState({
          user: session.user,
          profile,
          session,
          isLoading: false,
          isAdmin: !!profile?.is_admin,
        });
      } else {
        setAuthState((current) => ({ ...current, isLoading: false }));
      }

      return () => {
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Sign in successful",
        description: "Welcome back!",
      });
      
      // Instead of forcing page reload, we'll update the auth state directly
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        setAuthState({
          user: data.user,
          profile,
          session: data.session,
          isLoading: false,
          isAdmin: !!profile?.is_admin,
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      // Clean up existing state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Sign up successful",
        description: "Your account has been created. You may need to verify your email.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please check your details and try again",
        variant: "destructive",
      });
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      setAuthState((state) => ({
        ...state,
        user: null,
        profile: null,
        session: null,
        isAdmin: false,
      }));
      
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred while signing out",
        variant: "destructive",
      });
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!authState.user?.id) {
        throw new Error("User not authenticated");
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", authState.user.id)
        .select()
        .single();

      if (error) throw error;

      setAuthState((state) => ({
        ...state,
        profile: profile as UserProfile,
        isAdmin: !!profile.is_admin,
      }));

      toast({
        title: "Profile updated successfully",
      });

      return profile as UserProfile;
    } catch (error: any) {
      toast({
        title: "Profile update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
