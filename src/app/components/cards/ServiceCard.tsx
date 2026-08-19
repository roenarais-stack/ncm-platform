interface ServiceCardProps {
  title: string;
  description: string;
}

export default function ServiceCard({
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
        N
      </div>

      <h3 className="font-heading text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-4 font-body leading-7 text-slate-600">
        {description}
      </p>

    </div>
  );
}