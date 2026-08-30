import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Draw hairline vertical rules at the content edges — a grid marker, not a box. */
  rules?: boolean;
};

/** Centres content at the page max width and applies the horizontal gutter. */
export function Container({ children, className, rules = false }: ContainerProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-page px-gutter", className)}>
      {rules ? (
        // An absolutely positioned overlay repeating the gutter, so the rules
        // land exactly on the content edges. Out of flow and pointer-inert, so
        // it cannot affect layout or widen the document.
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 px-gutter">
          <div className="h-full border-x border-border" />
        </div>
      ) : null}
      {children}
    </div>
  );
}
