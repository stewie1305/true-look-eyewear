import { Moon, Sun } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { useThemeStore } from "@/app/store";

export function ModeToggle() {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDark ? "light" : "dark");
    }
  };

  const isDarkMode =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Button variant="outline" size="icon" className="relative rounded-full border-border/50 hover:bg-muted" onClick={toggleTheme}>
      {isDarkMode ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
