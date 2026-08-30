import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

/** Centres content at the page max width and applies the horizontal gutter. */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn("mx-auto w-full max-w-page px-gutter", className)}>{children}</div>;
}
