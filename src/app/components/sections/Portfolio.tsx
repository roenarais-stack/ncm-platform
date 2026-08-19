import SectionTitle from "@/app/components/ui/SectionTitle";
import PortfolioCard from "@/app/components/cards/PortfolioCard";
import { portfolioData } from "@/app/components/data/portfolioData";

export default function Portfolio() {
  return (
    <section
      id="portfolio"
      className="py-24"
    >
      <SectionTitle
        badge="Portfolio"
        title="Selected Work"
        description="A few examples of the brands and businesses we've helped grow through design, development and digital marketing."
      />

      <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {portfolioData.map((project) => (
          <PortfolioCard
            key={project.title}
            title={project.title}
            category={project.category}
            description={project.description}
            image={project.image}
            href={project.href}
          />
        ))}
      </div>
    </section>
  );
}