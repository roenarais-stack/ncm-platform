import TestimonialCard from "@/app/components/cards/TestimonialCard";
import SectionTitle from "@/app/components/ui/SectionTitle";
import { getPublishedTestimonials } from "@/app/lib/testimonials/queries";

const STATIC_TESTIMONIALS = [
  {
    id: "static-sarah-ahmed",
    name: "Sarah Ahmed",
    company: "Startup Founder",
    review:
      "NCM transformed our brand identity and website. The entire experience was smooth and highly professional.",
  },
  {
    id: "static-ali-raza",
    name: "Ali Raza",
    company: "Business Owner",
    review:
      "Excellent communication, premium quality work and timely delivery. Highly recommended.",
  },
  {
    id: "static-michael-james",
    name: "Michael James",
    company: "E-commerce Brand",
    review:
      "Our sales improved after the new branding and marketing strategy. Great team to work with.",
  },
];

type TestimonialDisplay = (typeof STATIC_TESTIMONIALS)[number];

export default async function Testimonials() {
  let testimonials: TestimonialDisplay[] = STATIC_TESTIMONIALS;

  try {
    const publishedTestimonials = await getPublishedTestimonials();
    if (publishedTestimonials.length > 0) {
      testimonials = publishedTestimonials.map((testimonial) => ({
        id: testimonial.id,
        name: testimonial.client_name,
        company: testimonial.company ?? "",
        review: testimonial.review,
      }));
    }
  } catch {
    // Keep the public section available if the database query fails.
  }

  return (
    <section
      id="testimonials"
      className="py-24"
    >
      <SectionTitle
        badge="Testimonials"
        title="What Our Clients Say"
        description="Trusted by businesses looking for quality, strategy and long-term growth."
        center
      />

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {testimonials.map((item) => (
          <TestimonialCard
            key={item.id}
            name={item.name}
            company={item.company}
            review={item.review}
          />
        ))}
      </div>
    </section>
  );
}
