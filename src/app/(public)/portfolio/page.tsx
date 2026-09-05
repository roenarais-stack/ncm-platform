import Container from "@/app/components/layout/Container";
import PortfolioCard from "@/app/components/cards/PortfolioCard";
import SectionTitle from "@/app/components/ui/SectionTitle";
import { getPublishedPortfolioItems } from "@/app/lib/portfolio/queries";

export default async function PortfolioPage() {
  const portfolioItems = await getPublishedPortfolioItems();

  return (
    <div className="bg-white py-16 sm:py-24">
      <Container>
        <SectionTitle
          badge="Portfolio"
          title="Our Work"
          description="Explore the brands and businesses NCM has helped through design, development, marketing, and digital strategy."
          center
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
      </Container>
    </div>
  );
}
