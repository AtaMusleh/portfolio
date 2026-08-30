"use client";

// Client component: next-themes reads localStorage and the OS media query, and
// exposes them through React context. Neither is available on the server.

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // false on purpose: the 200ms palette transition in globals.css is wanted.
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
