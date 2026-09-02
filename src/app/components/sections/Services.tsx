import ServiceCard from "@/app/components/cards/ServiceCard";
import SectionTitle from "@/app/components/ui/SectionTitle";
import {
  getPublishedServices,
  type Service,
} from "@/app/lib/services/queries";

const STATIC_SERVICES = [
  {
    id: "static-brand-identity",
    title: "Brand Identity",
    description:
      "Professional logo design, visual identity systems, typography, and brand guidelines that build trust.",
  },
  {
    id: "static-web-development",
    title: "Web Development",
    description:
      "Modern, responsive, fast-loading websites built with performance, SEO, and conversion in mind.",
  },
  {
    id: "static-digital-marketing",
    title: "Digital Marketing",
    description:
      "Social media management, paid advertising, content strategy, and lead generation campaigns.",
  },
  {
    id: "static-video-editing",
    title: "Video Editing",
    description:
      "High-quality promotional videos, reels, YouTube editing, motion graphics, and visual storytelling.",
  },
  {
    id: "static-ai-automation",
    title: "AI Automation",
    description:
      "Business automation, AI workflows, chatbots, and intelligent systems that save time and increase productivity.",
  },
  {
    id: "static-business-growth",
    title: "Business Growth",
    description:
      "Complete digital growth strategy combining branding, marketing, technology, and automation.",
  },
];

type ServiceData = Pick<Service, "id" | "title" | "description">;

export default async function Services() {
  let services: ServiceData[] = STATIC_SERVICES;

  try {
    const publishedServices = await getPublishedServices();
    if (publishedServices.length > 0) {
      services = publishedServices;
    }
  } catch {
    // If query fails, fall back to static services
  }

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
            key={service.id}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </section>
  );
}
