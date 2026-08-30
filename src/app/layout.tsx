import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";
import { site } from "@/content";
import { cn } from "@/lib/utils";

// Body and headings.
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Numbered markers, stack labels, metadata.
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-virid-seven-f13k2sqmwj.vercel.app"),
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", geistSans.variable, geistMono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="mono-label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-brand"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
