# Portfolio — Ata Musleh

Personal site: a home page and four engineering case studies. Built with the
Next.js App Router, statically prerendered.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 — tokens declared with `@theme` in `src/app/globals.css`, no
  `tailwind.config.js`
- next-themes for the light/dark palette (dark by default)
- Lenis for smooth scrolling, wired into GSAP's ticker
- Motion for entrance reveals; GSAP + ScrollTrigger for the pinned section and
  the Roam route animation
- shadcn/ui primitives on Radix (Tabs only, currently)

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm start
```

### Build before typecheck

On a clean checkout, run `npm run build` before `npx tsc --noEmit`. Next.js
generates typed-route definitions into `.next/types` during the build, and the
globally available `PageProps` / `LayoutProps` helpers resolve their route
literals against them. Type-checking first fails with errors like
`Type '"/work/[slug]"' does not satisfy the constraint 'AppRoutes'` — that is the
missing generated types, not a fault in the source.

## Where content lives

Everything editable is typed data under `src/content/`. No MDX, no CMS.

| File | Contents |
| --- | --- |
| `projects.ts` | The four case studies: tagline, summary, stack, repos, and the engineering highlights that make up each case study body |
| `experience.ts` | Roles |
| `about.ts` | Intro, education, interests, birth date (the About panel derives age from it) |
| `site.ts` | Name, role, location, tagline, availability, links, `resumeUrl` |
| `marquee.ts` | The stack ticker strip |
| `types.ts` | Shared types |
| `index.ts` | Re-exports plus `getProject()` and `getAdjacentProject()` |

Adding a project to `projects.ts` is enough — the home page list, the case study
route, `generateStaticParams`, the sitemap and the per-project OG image are all
derived from that array.

The age shown in the About panel is computed from `about.birthDate`, so
`src/app/page.tsx` sets `export const revalidate = 86400`. Without it the value
would be frozen at build time.

## Adding project images

The four screenshots are not in the repo yet. To add one:

1. Drop the file into `public/projects/` using exactly the expected name:
   `roam.png`, `taskflow.png`, `linksnip.png`, `fx-convert.png`.
2. Add `image: "/projects/<slug>.png"` to that project in
   `src/content/projects.ts`.

That is the whole job. The media frames on the home page and the case study hero
already branch on `project.image` and swap the deliberate empty frame for a
`next/image` fill. No component changes are needed.

## Audit scripts

`scripts/audit/` holds a headless-Chrome harness that checks reduced-motion
correctness, listener leaks, and responsive/accessibility invariants against the
**production** build. See `scripts/audit/README.md` for how to run them and for
the two measurement traps documented there — a signed listener counter that
drifts, and an opacity scanner that flags intentional translucency.

These are dev tooling: plain `.mjs` outside `src/`, never imported by the app,
excluded from lint and not part of the build.

## Notes

- `metadataBase` in `src/app/layout.tsx` points at the current Vercel URL. It
  must be updated if a custom domain is added, or every social preview will keep
  resolving against the old host.
- `/styleguide` renders every design token for reference. It is `noindex`,
  excluded from the sitemap, and disallowed in `robots.txt`.
- OG images, the favicon and the Apple touch icon are generated at build time
  with `next/og` so they cannot drift from the palette.
