import { useThemeStore } from "@/app/store";
import { useEffect } from "react";
const Theme = () => {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return null;
};
export default Theme;
