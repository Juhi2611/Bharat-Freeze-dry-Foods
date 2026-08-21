import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage on mount (after initial SSR hydration pass)
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("bff-theme") as Theme | null;
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
      }
    } catch {
      // localStorage may not be available in SSR context — ignore
    }
  }, []);

  // Apply body class whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    const body = document.body;
    if (theme === "light") {
      body.classList.add("light-theme");
      body.classList.remove("dark-theme");
    } else {
      body.classList.add("dark-theme");
      body.classList.remove("light-theme");
    }
    try {
      localStorage.setItem("bff-theme", theme);
    } catch {
      // ignore
    }
  }, [theme, mounted]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
