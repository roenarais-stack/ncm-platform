import { requirePermission } from "@/app/lib/auth/authorize";
import TestimonialForm from "../TestimonialForm";

export default async function CreateTestimonialPage() {
  await requirePermission("testimonials.manage");

  return (
    <section className="px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div>
          <a
            href="/admin/testimonials"
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Back to testimonials
          </a>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
            Add testimonial
          </h1>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <TestimonialForm />
        </div>
      </div>
    </section>
  );
}
