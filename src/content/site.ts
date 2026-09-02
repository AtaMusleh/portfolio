export type Site = {
  name: string
  role: string
  location: string
  tagline: string
  /** Cycled by the hero's typewriter line. Edit freely — these are placeholders. */
  rotatingPhrases: string[]
  contactHeadline: string
  contactHeadlineAccent: string
  availability: string
  email: string
  github: string
  linkedin: string
  /** Set to "/ata-musleh-cv.pdf" once the file exists; the nav button hides while null. */
  resumeUrl: string | null
}

export const site: Site = {
  name: "Ata Musleh",
  role: "Full-stack developer",
  location: "Ramallah, Palestine",
  tagline:
    "I build things end to end, and care most about the parts that are easy to get subtly wrong.",
  rotatingPhrases: [
    "Full-stack developer",
    "Problem solver",
    "Detail-obsessed",
    "Always shipping",
  ],
  contactHeadline: "Let's build something that ",
  contactHeadlineAccent: "holds up.",
  availability:
    "Open to remote roles internationally, and relocation with visa sponsorship.",
  email: "atamusleh3@gmail.com",
  github: "https://github.com/AtaMusleh",
  linkedin: "https://linkedin.com/in/ata-musleh-53600b265",
  resumeUrl: null,
}