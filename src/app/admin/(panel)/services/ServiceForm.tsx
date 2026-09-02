"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Service } from "@/app/lib/services/queries";
import {
  SERVICE_LIMITS,
} from "@/app/lib/services/validation";
import {
  saveService,
  type ServiceActionState,
} from "./actions";

const initialState: ServiceActionState = {};

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : editing ? "Save changes" : "Create service"}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}

export default function ServiceForm({ service }: { service?: Service }) {
  const [state, formAction] = useActionState(saveService, initialState);
  const editing = Boolean(service);

  return (
    <form action={formAction} className="space-y-6">
      {service && <input type="hidden" name="id" value={service.id} />}

      {state.message && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.message}
        </div>
      )}

      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Title</span>
        <input
          name="title"
          required
          maxLength={SERVICE_LIMITS.title}
          defaultValue={service?.title ?? ""}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <FieldError message={state.fieldErrors?.title} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Slug</span>
        <input
          name="slug"
          required
          defaultValue={service?.slug ?? ""}
          placeholder="service-slug"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <FieldError message={state.fieldErrors?.slug} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Description</span>
        <textarea
          name="description"
          required
          maxLength={SERVICE_LIMITS.description}
          defaultValue={service?.description ?? ""}
          rows={6}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <FieldError message={state.fieldErrors?.description} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Sort order</span>
        <input
          name="sort_order"
          type="number"
          min="0"
          step="1"
          defaultValue={service?.sort_order ?? 0}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <FieldError message={state.fieldErrors?.sort_order} />
      </label>

      <label className="flex items-center gap-3 text-sm font-semibold text-slate-800">
        <input
          name="is_published"
          type="checkbox"
          defaultChecked={service?.is_published ?? false}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        Published on the public website
      </label>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
        <a
          href="/admin/services"
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </a>
        <SubmitButton editing={editing} />
      </div>
    </form>
  );
}
