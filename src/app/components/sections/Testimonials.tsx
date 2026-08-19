import TestimonialCard from "@/app/components/cards/TestimonialCard";
import SectionTitle from "@/app/components/ui/SectionTitle";

const testimonials = [
  {
    name: "Sarah Ahmed",
    company: "Startup Founder",
    review:
      "NCM transformed our brand identity and website. The entire experience was smooth and highly professional.",
  },
  {
    name: "Ali Raza",
    company: "Business Owner",
    review:
      "Excellent communication, premium quality work and timely delivery. Highly recommended.",
  },
  {
    name: "Michael James",
    company: "E-commerce Brand",
    review:
      "Our sales improved after the new branding and marketing strategy. Great team to work with.",
  },
];

export default function Testimonials() {
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
            key={item.name}
            name={item.name}
            company={item.company}
            review={item.review}
          />
        ))}
      </div>
    </section>
  );
}