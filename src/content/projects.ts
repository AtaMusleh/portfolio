import type { Project } from "./types"

export const projects: Project[] = [
  {
    slug: "roam",
    name: "Roam",
    tagline: "Geotagged photos, clustered into an interactive journey map.",
    summary:
      "Roam turns a folder of geotagged photos into a navigable map of a trip. It groups photos into the places you actually stopped, names those places from OpenStreetMap data, and animates the route between them as you scroll.",
    year: "2025",
    role: "Solo — design and build",
    stack: ["Next.js 16", "TypeScript", "Prisma", "PostgreSQL", "Mapbox", "GSAP"],
    repos: [{ label: "Repository", url: "https://github.com/AtaMusleh/roam" }],
    live: "https://roam-khaki.vercel.app/trips",
    highlights: [
      {
        title: "Clustering in metres, not degrees",
        problem:
          "Off-the-shelf clustering treats latitude and longitude as a flat plane. A degree of longitude is 111km at the equator and nothing at the poles, so a fixed radius means completely different real-world distances depending on where the photos were taken.",
        approach:
          "I wrote DBSCAN from scratch using haversine distance, so the epsilon parameter is expressed in metres and behaves identically anywhere on the map.",
      },
      {
        title: "Temporal splitting",
        problem:
          "Pure spatial clustering merges a morning coffee and an evening return to the same cafe into one undifferentiated blob, which loses the shape of the trip.",
        approach:
          "Clusters split on time gaps, so a location resolves to one place with two separate visits rather than a single point with twice the photos.",
      },
      {
        title: "Recovering missing coordinates",
        problem:
          "Photos taken indoors or with GPS briefly unavailable have timestamps but no coordinates, and dropping them silently loses part of the journey.",
        approach:
          "Position is interpolated from the surrounding photos in the timeline, placing uncoordinated photos on the route between their neighbours.",
      },
      {
        title: "Naming places from OpenStreetMap",
        problem:
          "Reverse geocoding returns a street address, which is not what a person calls the place they visited.",
        approach:
          "Candidate OSM polygons containing the point are ranked by containment, so a cluster inside a park boundary is named for the park rather than the road beside it.",
      },
      {
        title: "Scroll-driven route animation",
        problem:
          "A static map of pins says where you went but not in what order or over how long.",
        approach:
          "The route draws itself along the Mapbox layer as you scroll, tying progress through the page to progress through the trip.",
      },
    ],
  },
  {
    slug: "taskflow",
    name: "TaskFlow",
    tagline: "Kanban task manager, split into an independently deployed API and client.",
    summary:
      "TaskFlow is a Kanban board built as two separately deployed applications: a standalone Express API and a React client. The split is deliberate — it forces a real network boundary, real auth, and a contract between the two that has to hold.",
    year: "2025",
    role: "Solo — design and build",
    stack: ["Express", "React", "TypeScript", "PostgreSQL", "Zod", "JWT"],
    repos: [
      { label: "API", url: "https://github.com/AtaMusleh/taskflow-api" },
      { label: "Client", url: "https://github.com/AtaMusleh/taskflow-client" },
    ],
    live: "https://taskflow-client-eta.vercel.app",
    highlights: [
      {
        title: "Fractional indexing for card order",
        problem:
          "Storing card position as a sequential integer means dropping a card between two others has to renumber every card below it, which is a write per row for a single drag.",
        approach:
          "Positions are fractional, so inserting between two cards computes a value between their two keys and updates exactly one row.",
      },
      {
        title: "Docs generated from the validators",
        problem:
          "Hand-written API documentation drifts from actual behaviour the moment an endpoint changes and the docs do not.",
        approach:
          "The OpenAPI spec is generated from the same Zod schemas that validate incoming requests, so the documentation cannot describe a contract the server does not enforce.",
      },
      {
        title: "Optimistic drag-and-drop with rollback",
        problem:
          "Waiting for a round trip before a card visibly moves makes the board feel broken even on a fast connection.",
        approach:
          "The move applies to local state immediately and reverts to the previous position if the request fails.",
      },
      {
        title: "Single-flight token refresh",
        problem:
          "When an access token expires, every in-flight request fails at once and each one independently tries to refresh, producing a burst of refresh calls and a race over which token wins.",
        approach:
          "Refresh is single-flight — the first 401 starts the refresh, everything else waits on that same promise and retries with the resulting token.",
      },
    ],
  },
  {
    slug: "linksnip",
    name: "LinkSnip",
    tagline: "URL shortener with click analytics that actually counts every click.",
    summary:
      "LinkSnip shortens URLs and tracks clicks. Most of the interesting work is in making sure the analytics are correct under serverless execution and browser caching, both of which quietly lose events if you let them.",
    year: "2025",
    role: "Solo — design and build",
    stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma"],
    repos: [{ label: "Repository", url: "https://github.com/AtaMusleh/linksnip" }],
    live: "https://linksnip-vert.vercel.app",
    highlights: [
      {
        title: "Click tracking that survives the response",
        problem:
          "A serverless invocation can be frozen the moment the response is sent, so a floating promise writing the click record may never finish.",
        approach:
          "Tracking runs inside Next's after(), which keeps the invocation alive for work scheduled after the response instead of relying on the process staying warm.",
      },
      {
        title: "302 rather than 301",
        problem:
          "Browsers cache a 301 permanently and go straight to the destination on every subsequent visit, skipping the server entirely and undercounting every repeat click.",
        approach: "Redirects return 302, so each click reaches the server and gets recorded.",
      },
      {
        title: "Collision-safe slugs",
        problem:
          "Random short slugs collide, and checking-then-inserting leaves a window where two concurrent requests can claim the same one.",
        approach:
          "Generation retries against a uniqueness constraint at the database level rather than trusting a prior existence check.",
      },
    ],
  },
  {
    slug: "fx-convert",
    name: "FX Convert",
    tagline: "Currency converter with historical ECB rate charts.",
    summary:
      "FX Convert converts between currencies and charts historical rates from ECB data. It is the smallest of the four projects and the one where the work went into caching correctly and getting the accessibility right.",
    year: "2025",
    role: "Solo — design and build",
    stack: ["Next.js 16", "TypeScript", "Tailwind", "Recharts"],
    repos: [{ label: "Repository", url: "https://github.com/AtaMusleh/fx-convert" }],
    live: "https://fx-convert-black.vercel.app",
    highlights: [
      {
        title: "Caching on the pair, not the amount",
        problem:
          "Keying the cached request on the full conversion request means every distinct amount is a separate cache entry, so the cache almost never hits.",
        approach:
          "The request is keyed on the currency pair alone, since the rate does not depend on the amount. The multiplication happens client-side against a cached rate.",
      },
      {
        title: "Server-side cached rate routes",
        problem:
          "Fetching upstream rates on every render wastes requests against a source that updates once a day.",
        approach:
          "Rate routes are cached server-side with a revalidation window matched to how often ECB actually publishes.",
      },
      {
        title: "WCAG contrast audit",
        problem:
          "Light mode had two text-on-background combinations that looked fine and failed contrast requirements.",
        approach:
          "An audit against WCAG AA caught both, and the palette was corrected rather than worked around.",
      },
    ],
  },
]
