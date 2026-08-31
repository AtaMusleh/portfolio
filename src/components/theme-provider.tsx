"use client";

// Client component: next-themes reads localStorage and the OS media query, and
// exposes them through React context. Neither is available on the server.

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      // dark by default: the ambient bloom reads far better on it, and that is the
      // intended first impression. The toggle still offers light and system.
      defaultTheme="dark"
      enableSystem
      // false on purpose: the 200ms palette transition in globals.css is wanted.
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
