"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Animated light/dark switch. A pill track whose gradient cross-fades between a
 * daytime sky and a night sky, with a thumb that slides (spring easing) and
 * carries a sun→moon morph. Decorative stars fade in for the night state.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();
  // Before mount we render the dark state (matches SSR) to avoid a flash.
  const isDark = mounted ? theme === "dark" : true;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      title={isDark ? "Светлая тема" : "Тёмная тема"}
      className={cn(
        "group relative inline-flex h-8 w-[60px] shrink-0 items-center rounded-full border p-1",
        "cursor-pointer transition-colors duration-500 outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
        isDark
          ? "border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950"
          : "border-black/5 bg-gradient-to-br from-sky-300 via-sky-200 to-amber-100",
        className,
      )}
    >
      {/* Stars — visible only at night */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-500",
          isDark ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="absolute left-2 top-1.5 h-[2px] w-[2px] rounded-full bg-white/80" />
        <span className="absolute left-3.5 top-4 h-[1.5px] w-[1.5px] rounded-full bg-white/60" />
        <span className="absolute left-2.5 top-5 h-[1px] w-[1px] rounded-full bg-white/50" />
      </span>

      {/* Sliding thumb with morphing icon */}
      <span
        className={cn(
          "relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full shadow-md",
          "transition-[transform,background-color] duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
          isDark
            ? "translate-x-[28px] bg-slate-800 text-amber-300"
            : "translate-x-0 bg-white text-amber-500",
        )}
      >
        <Sun
          className={cn(
            "absolute h-4 w-4 transition-all duration-300",
            isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
          )}
        />
        <Moon
          className={cn(
            "absolute h-4 w-4 transition-all duration-300",
            isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0",
          )}
        />
      </span>
    </button>
  );
}
