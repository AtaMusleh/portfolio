import { experience } from "@/content";

export function ExperienceList() {
  return (
    <ul className="flex flex-col gap-16">
      {experience.map((role) => (
        <li key={`${role.company}-${role.period}`}>
          <h3 className="text-h3 text-foreground">{role.company}</h3>

          <p className="mono-label mt-3 text-muted-foreground">
            {role.title}
            <span className="text-brand"> / </span>
            {role.period}
            <span className="text-brand"> / </span>
            {role.location}
          </p>

          <p className="mt-6 max-w-prose text-body text-muted-foreground">{role.description}</p>

          {/* list-none: the marker is a brand em dash, not a disc. */}
          <ul className="mt-8 flex list-none flex-col gap-3">
            {role.bullets.map((bullet) => (
              <li key={bullet} className="flex max-w-prose gap-4">
                <span aria-hidden="true" className="text-brand">
                  —
                </span>
                <span className="text-body text-muted-foreground">{bullet}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
