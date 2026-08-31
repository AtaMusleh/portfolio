import Image from "next/image";

import { ParallaxLayer } from "@/components/motion/parallax-layer";
import type { Project } from "@/content";
import { cn } from "@/lib/utils";

type MediaFrameProps = {
  project: Project;
  /** Tailwind aspect utility, e.g. "aspect-[16/9]". */
  aspect: string;
  sizes: string;
  className?: string;
};

/**
 * The framed screenshot slot. With no image set it renders a deliberate empty
 * frame rather than a broken one — the same pattern as the home page rows.
 */
export function MediaFrame({
  project,
  aspect,
  sizes,
  className,
}: MediaFrameProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border border-border bg-sky",
        aspect,
        className,
      )}
    >
      <ParallaxLayer>
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.name} screenshot`}
            fill
            sizes={sizes}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="mono-label text-muted-foreground">
              {project.name}
            </span>
          </div>
        )}
      </ParallaxLayer>
    </div>
  );
}
