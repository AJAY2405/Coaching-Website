import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  // ✅ Safe initialization (prevents flicker & invalid values)
  const [theme, setTheme] = useState(() => {
    // First check if there's a stored value
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
    // If no stored value, use defaultTheme and persist it
    localStorage.setItem(storageKey, defaultTheme);
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState("light");

  // ✅ Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let appliedTheme = theme;

    if (theme === "system") {
      appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    root.classList.add(appliedTheme);
    setResolvedTheme(appliedTheme);

    // Store only user preference (not resolved)
    localStorage.setItem(storageKey, theme);
  }, [theme]);

  // ✅ Listen to system theme changes (only when theme = system)
  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const newTheme = media.matches ? "dark" : "light";

      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);

      setResolvedTheme(newTheme);
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  // ✅ Context value
  const value = {
    theme,
    resolvedTheme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// ✅ Custom Hook
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};