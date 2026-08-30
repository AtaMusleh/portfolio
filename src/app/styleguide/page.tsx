import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false } };

const typeScale = [
  { name: "display", className: "text-display", spec: "clamp(3rem, 10vw, 8rem) / 0.95 / -0.03em / 500" },
  { name: "h1", className: "text-h1", spec: "clamp(2.5rem, 6vw, 4.5rem) / 1.0 / -0.02em / 500" },
  { name: "h2", className: "text-h2", spec: "clamp(1.75rem, 3.5vw, 2.5rem) / 1.1 / -0.02em / 500" },
  { name: "h3", className: "text-h3", spec: "clamp(1.25rem, 2vw, 1.5rem) / 1.2 / -0.01em / 500" },
  { name: "body-lg", className: "text-body-lg", spec: "1.125rem / 1.6 / normal / 400" },
  { name: "body", className: "text-body", spec: "1rem / 1.6 / normal / 400" },
  { name: "small", className: "text-small", spec: "0.875rem / 1.5 / normal / 400" },
  { name: "mono-sm", className: "mono-label", spec: "0.8125rem / 1.4 / 0.05em / 400 / uppercase" },
];

const colors = [
  { label: "background", token: "--background", utility: "bg-background", light: "#FBFCFD", dark: "#0B0F14", note: "cool near-white / cool near-black" },
  { label: "foreground", token: "--foreground", utility: "text-foreground", light: "#10151C", dark: "#E6EDF5", note: "body and heading text" },
  { label: "muted", token: "--muted", utility: "bg-muted", light: "#F0F4F9", dark: "#141A22", note: "raised surface" },
  { label: "muted-foreground", token: "--muted-foreground", utility: "text-muted-foreground", light: "#56637A", dark: "#8B99AC", note: "secondary text" },
  { label: "border", token: "--border", utility: "border-border", light: "#E1E8F0", dark: "#222B36", note: "hairline borders" },
  { label: "brand", token: "--brand", utility: "text-brand / bg-brand / border-brand", light: "#1E56C8", dark: "#5B9CFF", note: "read or clicked only" },
  { label: "brand-foreground", token: "--brand-foreground", utility: "text-brand-foreground", light: "#FFFFFF", dark: "#0B0F14", note: "text on brand fills" },
  { label: "sky", token: "--sky", utility: "bg-sky", light: "#CFE3FB", dark: "#16293F", note: "surface only, never text" },
  { label: "accent (shadcn surface)", token: "--accent", utility: "bg-accent", light: "#F0F4F9", dark: "#141A22", note: "shadcn-internal hover surface, never brand" },
  { label: "accent-foreground (shadcn surface)", token: "--accent-foreground", utility: "text-accent-foreground", light: "#10151C", dark: "#E6EDF5", note: "shadcn-internal, pinned to foreground" },
  { label: "destructive (shadcn)", token: "--destructive", utility: "text-destructive", light: "#C02626", dark: "#F87171", note: "shadcn-internal error colour" },
];

// Ratios computed from the hex values with the WCAG 2.x relative-luminance
// formula. Kept here so the page states the same numbers the palette was
// signed off against.
const contrast = [
  { pair: "foreground on background", light: "17.84:1", dark: "16.29:1", min: "7:1", fg: "--foreground", bg: "--background" },
  { pair: "muted-foreground on background", light: "5.91:1", dark: "6.64:1", min: "4.5:1", fg: "--muted-foreground", bg: "--background" },
  { pair: "brand on background", light: "6.35:1", dark: "7.00:1", min: "4.5:1", fg: "--brand", bg: "--background" },
  { pair: "brand on muted", light: "5.90:1", dark: "6.37:1", min: "4.5:1", fg: "--brand", bg: "--muted" },
  { pair: "brand-foreground on brand", light: "6.52:1", dark: "7.00:1", min: "4.5:1", fg: "--brand-foreground", bg: "--brand" },
  { pair: "foreground on sky", light: "13.99:1", dark: "12.51:1", min: "4.5:1", fg: "--foreground", bg: "--sky" },
  { pair: "foreground on muted", light: "16.59:1", dark: "14.82:1", min: "7:1", fg: "--foreground", bg: "--muted" },
];

const spacing = [
  { name: "py-section", value: "clamp(6rem, 12vw, 10rem)", note: "section vertical rhythm" },
  { name: "px-gutter", value: "clamp(1.5rem, 5vw, 6rem)", note: "page horizontal gutter" },
  { name: "max-w-page", value: "1440px", note: "max content width, centred" },
  { name: "max-w-prose", value: "68ch", note: "reading column width" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-12">
      <h2 className="mono-label mb-8 text-brand">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <main className="mx-auto w-full max-w-page px-gutter py-section">
      <h1 className="text-h1">Styleguide</h1>
      <p className="mt-4 max-w-prose text-body text-muted-foreground">
        Every design token rendered so it can be checked by eye. This page is a reference, not a
        designed page.
      </p>
      <p className="mt-4 max-w-prose border border-border bg-muted p-4 text-body text-foreground">
        This page renders in the <strong>active theme</strong> — the swatches below show whichever
        palette is currently applied. Use the toggle in the nav to switch. Both palettes&rsquo; hex
        values are listed side by side on every swatch and in the contrast table, so the inactive
        one can still be read.
      </p>

      <Section title="Type scale">
        <div className="flex flex-col gap-8">
          {typeScale.map((t) => (
            <div key={t.name}>
              <div className="mono-label text-muted-foreground">
                {t.name} — {t.spec}
              </div>
              <div className={`${t.className} mt-2`}>The quick brown fox 0123</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Color">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((c) => (
            <div key={c.token} className="border border-border">
              <div
                className="h-20 w-full border-b border-border"
                style={{ backgroundColor: `var(${c.token})` }}
              />
              <div className="p-3">
                <div className="mono-label">{c.label}</div>
                <div className="mono-label mt-1 text-muted-foreground">{c.token}</div>
                <dl className="mt-2 flex gap-6">
                  <div>
                    <dt className="mono-label text-muted-foreground">Light</dt>
                    <dd className="mono-label text-foreground">{c.light}</dd>
                  </div>
                  <div>
                    <dt className="mono-label text-muted-foreground">Dark</dt>
                    <dd className="mono-label text-foreground">{c.dark}</dd>
                  </div>
                </dl>
                <div className="mt-2 text-small text-muted-foreground">{c.note}</div>
                <div className="mt-1 text-small text-muted-foreground">{c.utility}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <p className="text-body text-foreground">text-foreground — body and heading text</p>
          <p className="text-body text-muted-foreground">
            text-muted-foreground — secondary text, metadata, captions
          </p>
          <p className="text-body">
            <a href="#top" className="text-brand underline">
              text-brand
            </a>{" "}
            — links, markers, separators, active nav, focus outlines. Never body text or headings.
          </p>
          <p className="inline-block w-fit bg-brand px-3 py-1 text-body text-brand-foreground">
            brand-foreground on a brand fill
          </p>
        </div>
      </Section>

      <Section title="Contrast ratios">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-small">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="mono-label py-2 pr-6 font-normal">Pair</th>
                <th className="mono-label py-2 pr-6 font-normal">Sample (active theme)</th>
                <th className="mono-label py-2 pr-6 font-normal">Light</th>
                <th className="mono-label py-2 pr-6 font-normal">Dark</th>
                <th className="mono-label py-2 pr-6 font-normal">Required</th>
                <th className="mono-label py-2 font-normal">Result</th>
              </tr>
            </thead>
            <tbody>
              {contrast.map((c) => (
                <tr key={c.pair} className="border-b border-border">
                  <td className="py-3 pr-6">{c.pair}</td>
                  <td className="py-3 pr-6">
                    <span
                      className="inline-block px-2 py-1"
                      style={{ backgroundColor: `var(${c.bg})`, color: `var(${c.fg})` }}
                    >
                      Sample text
                    </span>
                  </td>
                  <td className="py-3 pr-6 font-mono">{c.light}</td>
                  <td className="py-3 pr-6 font-mono">{c.dark}</td>
                  <td className="py-3 pr-6 font-mono text-muted-foreground">{c.min}</td>
                  <td className="py-3 font-mono">PASS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Sky as a large fill">
        <p className="mb-4 max-w-prose text-small text-muted-foreground">
          --sky is a surface only. The text below is --foreground, at 13.99:1 in light and 12.51:1 in dark. Text is
          never set in --sky, and --sky is never used for an interactive element.
        </p>
        <div className="bg-sky px-gutter py-16">
          <h3 className="text-h2 text-foreground">Foreground text on a sky fill</h3>
          <p className="mt-4 max-w-prose text-body-lg text-foreground">
            Section backgrounds, marquee strips, decorative blocks and screenshot frames are what
            this colour is for. It carries a whole band of the page without competing with the
            text sitting on it.
          </p>
        </div>
      </Section>

      <Section title="Spacing and layout">
        <ul className="flex flex-col gap-3">
          {spacing.map((s) => (
            <li key={s.name} className="flex flex-col gap-1">
              <span className="mono-label">
                {s.name} — {s.value}
              </span>
              <span className="text-small text-muted-foreground">{s.note}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <div className="mono-label mb-2 text-muted-foreground">px-gutter, rendered</div>
          <div className="bg-muted px-gutter py-4">
            <div className="border border-border bg-background p-4 text-small">
              content inside the gutter
            </div>
          </div>
        </div>
      </Section>

      <Section title="Focus states">
        <p className="mb-4 max-w-prose text-small text-muted-foreground">
          Tab through these. Each should show a 2px brand outline offset by 2px.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" className="border border-border bg-muted px-4 py-2 text-small">
            Button one
          </button>
          <button type="button" className="bg-brand px-4 py-2 text-small text-brand-foreground">
            Button two
          </button>
          <a href="#top" className="text-small text-brand underline">
            A link
          </a>
        </div>
      </Section>

      <Section title="Prose width">
        <p className="max-w-prose text-body-lg text-muted-foreground">
          This paragraph is constrained to max-w-prose, which is 68ch. It exists so the measure can
          be checked against real sentences rather than a number. A reading column that is too wide
          makes the eye lose its place returning to the start of the next line, and one that is too
          narrow breaks the rhythm of reading with constant returns. Sixty-eight characters sits in
          the range where neither happens, and it holds up across the fluid type sizes defined
          above because the unit is tied to the font size rather than to the viewport.
        </p>
      </Section>
    </main>
  );
}
