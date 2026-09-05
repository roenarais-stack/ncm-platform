import SectionTitle from "@/app/components/ui/SectionTitle";
import PortfolioCard from "@/app/components/cards/PortfolioCard";
import Link from "next/link";
import {
  getHomepagePortfolioItems,
  type PortfolioItem,
} from "@/app/lib/portfolio/queries";

export default async function Portfolio() {
  let portfolioItems: PortfolioItem[];

  try {
    portfolioItems = await getHomepagePortfolioItems();
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
              image={project.image_path ?? undefined}
              href={`/portfolio/${project.slug}`}
              externalUrl={project.external_url ?? undefined}
            />
          ))}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Link
          href="/portfolio"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all duration-300 hover:border-blue-600 hover:text-blue-600"
        >
          View All Portfolio
        </Link>
      </div>
    </section>
  );
}
