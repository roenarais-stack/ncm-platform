export default function TestimonialsLoading() {
  return (
    <section className="px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-8 w-56 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-96 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="h-11 w-36 animate-pulse rounded-xl bg-slate-200" />
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-4 px-6 py-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-16 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
