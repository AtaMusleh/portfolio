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

/**
 * The next project in array order, wrapping past the last back to the first.
 * An unknown slug yields the first project, so callers always get a Project.
 */
export function getAdjacentProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug)
  return projects[(index + 1) % projects.length]
}
