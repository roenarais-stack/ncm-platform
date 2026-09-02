"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Testimonial } from "@/app/lib/testimonials/queries";
import {
  saveTestimonial,
  type TestimonialActionState,
} from "./actions";

const initialState: TestimonialActionState = {};

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : editing ? "Save changes" : "Create testimonial"}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}

export default function TestimonialForm({
  testimonial,
}: {
  testimonial?: Testimonial;
}) {
  const [state, formAction] = useActionState(saveTestimonial, initialState);
  const editing = Boolean(testimonial);

  return (
    <form action={formAction} className="space-y-6">
      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}

      {state.message && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.message}
        </div>
      )}

      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Client name</span>
        <input
          name="client_name"
          required
          defaultValue={testimonial?.client_name ?? ""}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <FieldError message={state.fieldErrors?.client_name} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Company</span>
        <input
          name="company"
          defaultValue={testimonial?.company ?? ""}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Review</span>
        <textarea
          name="review"
          required
          defaultValue={testimonial?.review ?? ""}
          rows={6}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <FieldError message={state.fieldErrors?.review} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Avatar URL</span>
        <input
          name="avatar_url"
          type="url"
          inputMode="url"
          defaultValue={testimonial?.avatar_url ?? ""}
          placeholder="https://example.com/avatar.jpg"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <FieldError message={state.fieldErrors?.avatar_url} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Sort order</span>
        <input
          name="sort_order"
          type="number"
          min="0"
          step="1"
          defaultValue={testimonial?.sort_order ?? 0}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <FieldError message={state.fieldErrors?.sort_order} />
      </label>

      <label className="flex items-center gap-3 text-sm font-semibold text-slate-800">
        <input
          name="is_published"
          type="checkbox"
          defaultChecked={testimonial?.is_published ?? false}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        Published on the public website
      </label>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
        <a
          href="/admin/testimonials"
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </a>
        <SubmitButton editing={editing} />
      </div>
    </form>
  );
}
