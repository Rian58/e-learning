"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);

    setTimeout(() => setIsAnimating(false), 600);
  };

  if (!mounted) {
    return (
      <button
        className="relative h-10 w-10 rounded-full border-2 border-border bg-background flex items-center justify-center shrink-0"
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className="relative h-10 w-10 rounded-full border-2 border-border bg-background flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Sun
        className={`absolute h-[1.2rem] w-[1.2rem] text-amber-500 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
        strokeWidth={2.5}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] text-indigo-400 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
        strokeWidth={2.5}
      />
      <span
        className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none
          ${isAnimating ? "animate-ping bg-primary/20" : "bg-transparent"}`}
      />
    </button>
  );
}
