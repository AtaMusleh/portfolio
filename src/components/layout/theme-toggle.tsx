"use client";

// Client component: reads and writes the active theme, which only exists in the
// browser. It is one of exactly two client components on the site.

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ORDER = ["light", "dark", "system"] as const;

type ThemeName = (typeof ORDER)[number];

const LABELS: Record<ThemeName, string> = {
  light: "light",
  dark: "dark",
  system: "system",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount the resolved theme is unknowable on the server, so render a
  // placeholder of identical size. The nav does not shift when it swaps in.
  if (!mounted) {
    return <span aria-hidden="true" className="block size-8 shrink-0" />;
  }

  const current: ThemeName = ORDER.includes(theme as ThemeName) ? (theme as ThemeName) : "system";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];

  const Icon = current === "light" ? Sun : current === "dark" ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${LABELS[next]} theme`}
      className="flex size-8 shrink-0 items-center justify-center text-muted-foreground hover:text-brand"
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  );
}
