import WhyChooseCard from "@/app/components/cards/WhyChooseCard";
import SectionTitle from "@/app/components/ui/SectionTitle";

const items = [
  {
    title: "Strategy First",
    description:
      "Every project begins with research, planning and a clear business objective—not just design.",
  },
  {
    title: "Premium Quality",
    description:
      "Modern UI, clean development and attention to every detail that represents your brand professionally.",
  },
  {
    title: "Fast Delivery",
    description:
      "Efficient workflow and organized project management help us deliver on time.",
  },
  {
    title: "Long-Term Partnership",
    description:
      "We don't just complete projects—we support businesses as they continue to grow.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="bg-slate-50 py-24"
    >
      <SectionTitle
        badge="Why Choose NCM"
        title="Built for Businesses That Want Results"
        description="We combine branding, development and marketing into one complete system that helps businesses grow with confidence."
        center
      />

      <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <WhyChooseCard
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}