"use client";

export default function PortfolioError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <section className="px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-xl font-semibold text-red-900">
          Portfolio could not be loaded
        </h1>
        <p className="mt-2 text-sm leading-6 text-red-700">
          Please try again. Your existing portfolio data has not been changed.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
