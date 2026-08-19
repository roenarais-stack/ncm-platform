interface WhyChooseCardProps {
  title: string;
  description: string;
}

export default function WhyChooseCard({
  title,
  description,
}: WhyChooseCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-600 hover:shadow-xl">

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-600">
        ✓
      </div>

      <h3 className="text-xl font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-slate-600">
        {description}
      </p>

    </div>
  );
}