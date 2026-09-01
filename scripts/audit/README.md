# Audit scripts

Dev tooling. These drive a headless Chrome over the DevTools Protocol and assert
things that are easy to break and hard to see: reduced-motion correctness,
listener leaks, and layout regressions. They are **not** part of the app — they
live outside `src/`, are never imported by it, and are excluded from the build
(see "Build exclusion" below).

## Running them

They measure the **production** build, not `next dev`.

```bash
npm run build
npm start -- -p 3987                 # or any port; see AUDIT_URL below

# in a second terminal
chrome --headless=new --remote-debugging-port=9333 --user-data-dir=/tmp/audit about:blank

node scripts/audit/reduced-motion-diff.mjs
node scripts/audit/listener-leak.mjs
node scripts/audit/responsive.mjs
```

Environment:

- `AUDIT_URL` — base URL under test (default `http://127.0.0.1:3987`)
- `CDP_PORT` — Chrome remote-debugging port (default `9333`)

Run Chrome **without** `--disable-gpu` for anything performance-related. Forced
software rasterisation inflates large-area repaint costs by an order of
magnitude and will make compositor-friendly effects look catastrophic.

## What each script checks

### `cdp.mjs`

Shared harness: opens a CDP session, and exposes `go()` (navigate with viewport,
theme and `prefers-reduced-motion` applied), `ev()` (evaluate in page), `key()`
(dispatch real key events), and `on`/`off` for raw CDP events. Also exports
colour helpers — `TO_RGB` resolves any CSS colour to sRGB bytes via an in-page
canvas, so `lab()`/`oklch()` computed values can be compared, plus `contrast()`
and `hex()`.

Two things worth knowing:

- `go()` accepts `theme` and seeds `localStorage.theme` before the document
  loads. Emulating `prefers-color-scheme` **does not** switch the site's theme,
  because the app defaults to `dark` rather than `system`.
- Emulating the `hover` and `pointer` media features via
  `Emulation.setEmulatedMedia` does **not** work — `matchMedia` still reports a
  fine pointer. Real touch needs
  `setDeviceMetricsOverride({ mobile: true })` plus `setTouchEmulationEnabled`.

### `reduced-motion-diff.mjs`

The differential reduced-motion scanner. For all five pages in both themes it
captures a per-element signature (opacity, transform) with motion enabled and
fully settled, then compares that against three checkpoints under
`prefers-reduced-motion: reduce` — at the top, after scrolling to the bottom,
and after scrolling back up. It also counts elements with a live
`animation-name`, a `transition-duration` above 1ms, or a `data-reveal` wrapper;
under reduce all three must be zero.

### `listener-leak.mjs`

Toggles `prefers-reduced-motion` on and off six times without reloading and
counts what is still alive after each cycle: window/document listeners tracked
**by function identity**, `IntersectionObserver` and `ResizeObserver` instances,
GSAP pin spacers, Motion reveal wrappers, whether Lenis is mounted, and whether
the marquee animation is running. Every counter must return to its baseline on
every cycle.

It also captures the **first painted frame**: a script injected before the
document runs records computed styles inside the first `requestAnimationFrame`
callback. rAF runs before the frame is committed, so this is the state frame 1
will actually show — which is how you catch a one-frame flash of an animation's
initial state.

### `responsive.mjs`

Sweeps five pages × eight widths × two themes and reports horizontal overflow,
text below 14px, overlapping siblings, and tap targets under 44×44 below the
`md` breakpoint. Also spot-checks layout invariants: hero bottom block, project
row stacking, PROBLEM/APPROACH columns, marquee clipping, About tab wrapping.

## Two methodology traps

Both of these produced confident, wrong results before being caught. If you
extend these scripts, do not reintroduce them.

**1. A signed add/remove counter drifts.** Counting `addEventListener` as `+1`
and `removeEventListener` as `-1` reported a leak of one `resize` listener per
toggle cycle. There was no leak. Libraries routinely call `removeEventListener`
for handlers they never added — a defensive cleanup that removes nothing — and
each of those decrements a counter that was never incremented. Track listeners
by **function identity** in a `Set` instead. The corrected measurement showed a
stable count with a few identities swapped, which is exactly what destroying and
recreating Lenis and GSAP should look like.

**2. A naive opacity scanner flags intentional translucency.** Flagging every
element with `opacity < 1` reported 18 "stuck" elements on the home page under
reduce. All 18 were design: inactive scroll-spy dashes at `0.3`, ambient bloom
shapes at `0.16`/`0.14`/`0.12`, card watermark icons at `0.07`. The fix is to
define the defect precisely — invisible (`opacity < 0.03`) or displaced
(translation over 2px) — or better, to diff against the settled motion-enabled
render, which is what `reduced-motion-diff.mjs` does. A scanner that cannot
distinguish "deliberately faint" from "stuck at the start of a fade" will bury a
real bug in noise.

A related trap that bit the same way: comparing two renders **by DOM index**
misaligns when element counts differ between modes. `Magnetic` and
`ParallaxLayer` render wrapper elements only when pointer effects are enabled,
so every index after them shifts and the diff reports nonsense.

## Build exclusion

These are `.mjs` files outside `src/`, so:

- Next.js never traces or bundles them — nothing in `src/` imports them.
- `tsconfig.json` includes `**/*.ts`, which does not match `.mjs`, so
  `tsc --noEmit` ignores them.
- They are listed in `.eslintignore`/`eslint.config.mjs` ignores so lint does not
  try to parse browser-context template strings as app code.

Verified by checking that the build output contains no reference to them.
