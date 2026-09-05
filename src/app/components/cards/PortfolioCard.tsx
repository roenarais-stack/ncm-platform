import Image from "next/image";
import Link from "next/link";

interface PortfolioCardProps {
  title: string;
  category: string;
  description: string;
  image?: string;
  href: string;
  externalUrl?: string;
}

export default function PortfolioCard({
  title,
  category,
  description,
  image,
  href,
  externalUrl,
}: PortfolioCardProps) {
  const canRenderImage = image?.startsWith("/") ?? false;

  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">

      {/* Project Image */}
      <div className="relative mb-5 h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100">

        {canRenderImage && image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl font-bold text-blue-600/40">
            NCM
          </div>
        )}

      </div>

      {/* Category */}
      <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
        {category}
      </span>

      {/* Title */}
      <h3 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 font-body leading-7 text-slate-600">
        {description}
      </p>

      {/* Case Study */}
      {href && (
        <Link
          href={href}
          className="mt-6 inline-flex font-heading text-sm font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-800"
        >
          View Case Study →
        </Link>
      )}

      {externalUrl && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex font-heading text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-slate-900"
        >
          Visit Project
        </a>
      )}

    </article>
  );
}
