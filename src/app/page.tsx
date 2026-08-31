import { AboutTabs } from "@/components/home/about-tabs";
import { Contact } from "@/components/home/contact";
import { ExperienceList } from "@/components/home/experience-list";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { ProjectList } from "@/components/home/project-list";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { about } from "@/content";
import { getAge } from "@/lib/age";

/**
 * The age shown in the About panel is derived from a birth date, so a value
 * computed once at build time would freeze and eventually be wrong. Revalidating
 * daily keeps the page static and server-rendered while bounding the staleness
 * to 24 hours — at worst the number is a day late on one birthday per year.
 */
export const revalidate = 86400;

export default function Home() {
  const age = getAge(about.birthDate);

  return (
    <>
      <Hero />

      <Container rules>
        <Section
          number="01"
          title="Selected Work"
          id="work"
          meta="Four projects"
        >
          <ProjectList />
        </Section>
      </Container>

      {/* Outside the Container so it spans the body width — see marquee.tsx. */}
      <Marquee />

      <Container>
        <Section number="02" title="About" id="about" meta="Who I am">
          <Reveal>
            <AboutTabs age={age} />
          </Reveal>
        </Section>

        <Section
          number="03"
          title="Experience"
          id="experience"
          meta="Current role"
        >
          <ExperienceList />
        </Section>

        <Section number="04" title="Contact" id="contact" meta="Get in touch">
          <Contact />
        </Section>
      </Container>
    </>
  );
}
