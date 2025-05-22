
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if user has previously set theme
    const savedTheme = localStorage.getItem("theme");
    
    // Check user's system preference if no saved theme
    if (!savedTheme) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    return (savedTheme as Theme) || "dark";
  });

  const { authState } = useAuth();

  // Apply theme class to document element
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Add transition class before changing theme
    root.classList.add("transition-colors", "duration-300");
    
    // Update theme class immediately
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    localStorage.setItem("theme", theme);
    
    // Save theme to user profile if logged in
    if (authState.user?.id) {
      const saveThemeToProfile = async () => {
        try {
          await supabase
            .from("profiles")
            .update({ preferred_theme: theme })
            .eq("id", authState.user!.id);
        } catch (error) {
          console.error("Error saving theme preference:", error);
        }
      };
      
      saveThemeToProfile();
    }
  }, [theme, authState.user?.id]);

  // Fetch theme from user profile when logged in
  useEffect(() => {
    const fetchThemePreference = async () => {
      if (authState.user?.id) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("preferred_theme")
            .eq("id", authState.user.id)
            .single();
            
          if (error) throw error;
          
          if (data && data.preferred_theme) {
            setTheme(data.preferred_theme as Theme);
          }
        } catch (error) {
          console.error("Error fetching theme preference:", error);
        }
      }
    };
    
    fetchThemePreference();
  }, [authState.user?.id]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    
    // Add listener for changes
    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
