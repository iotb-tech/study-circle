"use client";

import { useLayoutEffect } from "react";
import useLocalStorage from "./useLocalStorage";

type Theme = "light" | "dark";

export default function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "light");

  useLayoutEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setLightTheme = () => setTheme("light");
  const setDarkTheme = () => setTheme("dark");

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
  };
}
