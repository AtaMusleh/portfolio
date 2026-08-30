export type Highlight = {
  title: string
  problem: string
  approach: string
}

export type Project = {
  slug: string
  name: string
  tagline: string // one line, used on the home page card
  summary: string // 2-3 sentences, used at the top of the case study
  year: string
  role: string
  stack: string[]
  repos: { label: string; url: string }[]
  live: string
  highlights: Highlight[]
}

export type Role = {
  company: string
  title: string
  period: string
  location: string
  description: string
  bullets: string[]
}

export type Stat = {
  value: number
  suffix?: string
  label: string
}
