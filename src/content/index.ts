import { projects } from "./projects"
import type { Project } from "./types"

export type { Highlight, Project, Role, Stat } from "./types"
export { projects } from "./projects"
export { experience } from "./experience"
export { marqueeItems } from "./marquee"
export { site } from "./site"

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
