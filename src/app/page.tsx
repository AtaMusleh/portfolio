import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { site } from "@/content";

export default function Home() {
  return (
    <Container>
      <div className="py-section">
        <h1 className="text-display text-foreground">{site.name}</h1>
        <p className="mt-8 max-w-prose text-body-lg text-muted-foreground">{site.tagline}</p>
      </div>

      <Section number="01" title="Selected Work" id="work" className="min-h-screen">
        <p className="text-muted-foreground">Placeholder.</p>
      </Section>

      <Section number="02" title="Experience" id="experience" className="min-h-screen">
        <p className="text-muted-foreground">Placeholder.</p>
      </Section>

      <Section number="03" title="Contact" id="contact" className="min-h-screen">
        <p className="text-muted-foreground">Placeholder.</p>
      </Section>
    </Container>
  );
}
