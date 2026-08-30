export type Education = {
  degree: string
  institution: string
  period: string
}

export const about = {
  birthDate: "2004-03-04",
  intro:
    "I'm a software developer in Ramallah, building banking applications at Experts Turnkey Solutions and, outside that, tools that solve problems I actually ran into.",
  education: {
    degree: "BSc Computer Science",
    institution: "Birzeit University",
    period: "2021 — 2025",
  } satisfies Education,
  interests: ["Lifting", "Gaming"],
} as const
