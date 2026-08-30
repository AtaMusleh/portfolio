import { ProjectRow } from "@/components/home/project-row";
import { projects } from "@/content";

export function ProjectList() {
  return (
    <ul className="border-b border-border">
      {projects.map((project, index) => (
        <ProjectRow key={project.slug} project={project} index={index} />
      ))}
    </ul>
  );
}
