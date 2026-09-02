"use client";

export default function ServicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-red-900">
            Unable to load services
          </h1>
          <p className="mt-2 text-sm text-red-700">{error.message}</p>
          <button
            onClick={reset}
            className="mt-4 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    </section>
  );
}
