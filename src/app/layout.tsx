import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";
import { ActiveSectionProvider } from "@/components/motion/active-section";
import { Cursor } from "@/components/motion/cursor";
import { ScrollSpy } from "@/components/motion/scroll-spy";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";
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

const SITE_URL = "https://portfolio-virid-seven-f13k2sqmwj.vercel.app";

export const metadata: Metadata = {
  // Every relative URL in this file — OG images included — resolves against
  // this. It MUST be updated if a custom domain is added, or social previews
  // will keep pointing at the Vercel subdomain.
  metadataBase: new URL(SITE_URL),
  title: {
    // The home page uses the full string; every other route supplies only its
    // own name and gets the suffix, so a case study reads "Roam — Ata Musleh".
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  keywords: [
    "full-stack developer",
    "TypeScript",
    "Next.js",
    "React",
    "PostgreSQL",
    "Appian",
    "Ramallah",
    site.name,
  ],
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: next-themes writes the theme class onto <html>
    // from a blocking script before React hydrates, so server and client markup
    // differ by that attribute. This suppresses the html element's own attribute
    // diff only — it does not extend to any child.
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
      )}
    >
      <head>
        {/* If scripts never run, Motion never animates the hidden state away.
            This makes every revealed element final-state for those users. */}
        <noscript>
          <style>
            {"[data-reveal]{opacity:1!important;transform:none!important}"}
          </style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {/* Wraps the nav and the page so both read one observer. */}
          <ActiveSectionProvider>
            <a
              href="#main"
              className="mono-label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-brand"
            >
              Skip to content
            </a>
            <Cursor />
            <SiteNav />
            {/* tabIndex={-1}: without it a skip link only scrolls — focus stays on
              body and the next Tab can fall back into the nav. */}
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              <SmoothScroll>
                <ScrollSpy />
                {children}
              </SmoothScroll>
            </main>
            <SiteFooter />
          </ActiveSectionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
