interface SectionTitleProps {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionTitle({
  badge,
  title,
  description,
  center = false,
}: SectionTitleProps) {
  return (
    <div
      className={
        center
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl"
      }
    >
      {badge && (
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          {badge}
        </p>
      )}

      <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 font-body text-lg leading-8 text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}