
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggleTheme = () => {
    // Toggle to the opposite theme
    const newTheme = theme === "light" ? "dark" : "light";
    
    // Apply the theme toggle
    toggleTheme();
    
    // Show toast notification
    toast(`Switched to ${newTheme} mode`, {
      description: `Theme preference saved.`,
      position: "bottom-right",
    });
  };

  // Make sure the document has the correct theme class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleTheme}
          className="rounded-full w-10 h-10 bg-background/70 backdrop-blur transition-all duration-300 hover:scale-110"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-foreground transition-transform duration-500 rotate-0" />
          ) : (
            <Sun className="h-5 w-5 text-foreground transition-transform duration-500 rotate-0" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Switch to {theme === "light" ? "dark" : "light"} mode</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;
