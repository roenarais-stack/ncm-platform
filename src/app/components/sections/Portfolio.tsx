import SectionTitle from "@/app/components/ui/SectionTitle";
import PortfolioCard from "@/app/components/cards/PortfolioCard";
import {
  getPublishedPortfolioItems,
  type PortfolioItem,
} from "@/app/lib/portfolio/queries";

export default async function Portfolio() {
  let portfolioItems: PortfolioItem[];

  try {
    portfolioItems = await getPublishedPortfolioItems();
  } catch {
    portfolioItems = [];
  }

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

      {portfolioItems.length === 0 ? (
        <p className="mt-16 text-center text-slate-600">
          Our latest work will be here soon.
        </p>
      ) : (
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {portfolioItems.map((project) => (
            <PortfolioCard
              key={project.id}
              title={project.title}
              category={project.category}
              description={project.description}
              href={project.external_url ?? undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}