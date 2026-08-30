import { cn } from "@/lib/utils";

type SectionProps = {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

/**
 * A numbered top-level section. The `scroll-mt-20` offset keeps the hairline
 * border and header clear of the sticky nav when an anchor link lands here —
 * scroll-margin-top is what Next uses for hash navigation.
 */
export function Section({ number, title, children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-20 border-t border-border py-section", className)}>
      <header className="mb-16">
        <p className="mono-label text-brand">{number} /</p>
        <h2 className="mt-4 text-h2 text-foreground">{title}</h2>
      </header>
      {children}
    </section>
  );
}
