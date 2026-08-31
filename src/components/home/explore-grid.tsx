import {
  ArrowRight,
  Columns3,
  Layers,
  Link2,
  LineChart,
  Mail,
  Map,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { getProject, marqueeItems, site } from "@/content";

type Card = {
  title: string;
  href: string;
  Icon: LucideIcon;
  /** Pulled from existing content — no new claims are written here. */
  description: string;
  cta: string;
  accent: "brand" | "brand-2";
};

const roam = getProject("roam");
const taskflow = getProject("taskflow");
const linksnip = getProject("linksnip");
const fx = getProject("fx-convert");

const CARDS: Card[] = [
  {
    title: "The engineering behind Roam",
    href: "/work/roam",
    Icon: Map,
    description: roam?.highlights[0]?.title ?? "",
    cta: "Read the case study",
    accent: "brand",
  },
  {
    title: "How TaskFlow splits API and client",
    href: "/work/taskflow",
    Icon: Columns3,
    description: taskflow?.tagline ?? "",
    cta: "Read the case study",
    accent: "brand-2",
  },
  {
    title: "Getting click analytics right",
    href: "/work/linksnip",
    Icon: Link2,
    description: linksnip?.highlights[0]?.title ?? "",
    cta: "Read the case study",
    accent: "brand",
  },
  {
    title: "Caching rates, not amounts",
    href: "/work/fx-convert",
    Icon: LineChart,
    description: fx?.highlights[0]?.title ?? "",
    cta: "Read the case study",
    accent: "brand-2",
  },
  {
    title: "Work with me",
    href: "#contact",
    Icon: Mail,
    description: site.availability,
    cta: "Get in touch",
    accent: "brand",
  },
  {
    title: "What I'm building on",
    href: "#about",
    Icon: Layers,
    // The stack ticker's own content, which is exactly what this card names.
    description: marqueeItems.slice(0, 5).join(" · "),
    cta: "More about me",
    accent: "brand-2",
  },
];

const ACCENT = {
  brand: {
    text: "text-brand",
    border: "hover:border-brand focus-visible:border-brand",
  },
  "brand-2": {
    text: "text-brand-2",
    border: "hover:border-brand-2 focus-visible:border-brand-2",
  },
} as const;

export function ExploreGrid() {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((card, index) => {
        const accent = ACCENT[card.accent];
        return (
          <Reveal as="li" key={card.title} delay={index * 80}>
            {/* A single link: the whole card is clickable, and nothing inside
                it is an anchor. */}
            <Link
              href={card.href}
              className={`group relative flex h-full min-h-44 flex-col overflow-hidden rounded-xl border border-border bg-muted p-8 transition duration-150 hover:bg-[color-mix(in_oklab,var(--muted),var(--foreground)_4%)] focus-visible:bg-[color-mix(in_oklab,var(--muted),var(--foreground)_4%)] ${accent.border}`}
            >
              <h3 className={`text-h3 ${accent.text}`}>{card.title}</h3>

              <p className="mt-3 text-body text-muted-foreground">
                {card.description}
              </p>

              <span
                className={`mono-label mt-auto flex items-center gap-2 pt-8 underline ${accent.text}`}
              >
                {card.cta}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition duration-150 group-hover:translate-x-1 group-focus-visible:translate-x-1"
                />
              </span>

              {/* Watermark: bled past the corner and clipped by the card. */}
              <card.Icon
                aria-hidden="true"
                strokeWidth={1}
                className="pointer-events-none absolute -right-5 -bottom-5 size-[100px] opacity-[0.07]"
              />
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}
