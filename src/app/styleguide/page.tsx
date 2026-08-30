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
  { token: "--background", utility: "bg-background", hex: "#0F0D0B", note: "warm near-black" },
  { token: "--foreground", utility: "text-foreground", hex: "#EDE8E1", note: "warm off-white" },
  { token: "--muted", utility: "bg-muted", hex: "#1A1614", note: "raised surface" },
  { token: "--muted-foreground", utility: "text-muted-foreground", hex: "#A39A90", note: "secondary text" },
  { token: "--border", utility: "border-border", hex: "#2A2422", note: "hairline borders" },
  { token: "--accent", utility: "text-accent", hex: "#F2A03D", note: "amber — restricted use" },
  { token: "--accent-foreground", utility: "text-accent-foreground", hex: "#0F0D0B", note: "text on accent fills" },
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
      <h2 className="mono-label mb-8 text-accent">{title}</h2>
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
                <div className="mono-label">{c.token}</div>
                <div className="mono-label text-muted-foreground">
                  {c.hex} · {c.utility}
                </div>
                <div className="mt-1 text-small text-muted-foreground">{c.note}</div>
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
            <span className="text-accent">text-accent</span> — markers, hover, separators, active
            nav, small marks only
          </p>
          <p className="inline-block w-fit bg-accent px-3 py-1 text-body text-accent-foreground">
            accent-foreground on an accent fill
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
          Tab through these. Each should show a 2px accent outline offset by 2px.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" className="border border-border bg-muted px-4 py-2 text-small">
            Button one
          </button>
          <button
            type="button"
            className="bg-foreground px-4 py-2 text-small text-background"
          >
            Button two
          </button>
          <a href="#top" className="text-small underline hover:text-accent">
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
