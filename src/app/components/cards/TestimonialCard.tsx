interface TestimonialCardProps {
  name: string;
  company: string;
  review: string;
}

export default function TestimonialCard({
  name,
  company,
  review,
}: TestimonialCardProps) {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">

      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
        “
      </div>

      <p className="font-body leading-7 text-slate-600">
        {review}
      </p>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <h3 className="font-heading font-semibold text-slate-900">
          {name}
        </h3>

        <p className="mt-1 font-body text-sm text-slate-500">
          {company}
        </p>
      </div>

    </article>
  );
}