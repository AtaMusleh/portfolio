import { cn } from "@/lib/utils";

type SectionProps = {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Short right-aligned descriptor in the header row. */
  meta?: string;
};

/**
 * A numbered top-level section. The `scroll-mt-20` offset keeps the hairline
 * border and header clear of the sticky nav when an anchor link lands here —
 * scroll-margin-top is what Next uses for hash navigation.
 *
 * The header stacks below sm: at 320px the title and meta together exceed the
 * content width, so justify-between only kicks in from sm up.
 */
export function Section({ number, title, children, className, id, meta }: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-20 border-t border-border py-section", className)}>
      <header className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div>
          <p className="mono-label text-brand">{number} /</p>
          <h2 className="mt-4 text-h2 text-foreground">{title}</h2>
        </div>
        {meta ? (
          <p className="mono-label text-muted-foreground sm:pt-1 sm:text-right">{meta}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
