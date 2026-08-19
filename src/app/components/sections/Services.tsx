import ServiceCard from "@/app/components/cards/ServiceCard";
import SectionTitle from "@/app/components/ui/SectionTitle";

const services = [
  {
    title: "Brand Identity",
    description:
      "Professional logo design, visual identity systems, typography, and brand guidelines that build trust.",
  },
  {
    title: "Web Development",
    description:
      "Modern, responsive, fast-loading websites built with performance, SEO, and conversion in mind.",
  },
  {
    title: "Digital Marketing",
    description:
      "Social media management, paid advertising, content strategy, and lead generation campaigns.",
  },
  {
    title: "Video Editing",
    description:
      "High-quality promotional videos, reels, YouTube editing, motion graphics, and visual storytelling.",
  },
  {
    title: "AI Automation",
    description:
      "Business automation, AI workflows, chatbots, and intelligent systems that save time and increase productivity.",
  },
  {
    title: "Business Growth",
    description:
      "Complete digital growth strategy combining branding, marketing, technology, and automation.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="py-24"
    >
      <SectionTitle
        badge="Our Services"
        title="Everything Your Business Needs"
        description="NCM provides complete digital solutions designed to help businesses grow, scale, and compete in the modern market."
        center
      />

      <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </section>
  );
}