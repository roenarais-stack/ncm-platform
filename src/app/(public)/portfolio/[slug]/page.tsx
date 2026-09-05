import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Container from "@/app/components/layout/Container";
import {
  getPublishedPortfolioItemBySlug,
  getPublishedPortfolioItemServices,
} from "@/app/lib/portfolio/queries";

export default async function PortfolioCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedPortfolioItemBySlug(slug);

  if (!project) notFound();
  const services = await getPublishedPortfolioItemServices(project.id);
  const canRenderCoverImage = project.image_path?.startsWith("/") ?? false;

  return (
    <article className="bg-white py-16 sm:py-24">
      <Container className="max-w-4xl">
        <Link
          href="/portfolio"
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
        >
          Back to portfolio
        </Link>

        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          {project.category}
        </p>
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {project.title}
        </h1>

        {canRenderCoverImage && project.image_path && (
          <div className="relative mt-10 h-72 overflow-hidden rounded-3xl bg-slate-100 sm:h-96">
            <Image
              src={project.image_path}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <section className="mt-10 border-t border-slate-200 pt-10">
          <h2 className="font-heading text-2xl font-semibold text-slate-900">
            Project Overview
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {project.overview ?? project.description}
          </p>
        </section>

        {services.length > 0 && (
          <section className="mt-10">
            <h2 className="font-heading text-2xl font-semibold text-slate-900">
              Services Delivered
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {services.map((service) => (
                <li key={service.id} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {service.title}
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.challenge && (
          <CaseStudySection title="Challenge" content={project.challenge} />
        )}
        {project.solution && (
          <CaseStudySection title="Solution" content={project.solution} />
        )}
        {project.outcome && (
          <CaseStudySection title="Outcome" content={project.outcome} />
        )}

        {project.external_url && (
          <div className="mt-10">
            <a
              href={project.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Visit Project
            </a>
          </div>
        )}
      </Container>
    </article>
  );
}

function CaseStudySection({ title, content }: { title: string; content: string }) {
  return (
    <section className="mt-10">
      <h2 className="font-heading text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-4 whitespace-pre-wrap text-lg leading-8 text-slate-600">{content}</p>
    </section>
  );
}
