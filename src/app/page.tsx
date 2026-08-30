import { Contact } from "@/components/home/contact";
import { ExperienceList } from "@/components/home/experience-list";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { ProjectList } from "@/components/home/project-list";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export default function Home() {
  return (
    <>
      <Hero />

      <Container>
        <Section number="01" title="Selected Work" id="work">
          <ProjectList />
        </Section>
      </Container>

      {/* Outside the Container so it spans the body width — see marquee.tsx. */}
      <Marquee />

      <Container>
        <Section number="02" title="Experience" id="experience">
          <ExperienceList />
        </Section>

        <Section number="03" title="Contact" id="contact">
          <Contact />
        </Section>
      </Container>
    </>
  );
}
