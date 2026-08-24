"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { PortfolioItem } from "@/app/lib/portfolio/queries";
import {
  PORTFOLIO_LIMITS,
} from "@/app/lib/portfolio/validation";
import {
  savePortfolioItem,
  type PortfolioActionState,
} from "./actions";

const initialState: PortfolioActionState = {};

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : editing ? "Save changes" : "Create item"}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}

export default function PortfolioForm({ item }: { item?: PortfolioItem }) {
  const [state, formAction] = useActionState(savePortfolioItem, initialState);
  const editing = Boolean(item);

  return (
    <form action={formAction} className="space-y-6">
      {item && <input type="hidden" name="id" value={item.id} />}

      {state.message && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Title</span>
          <input
            name="title"
            required
            maxLength={PORTFOLIO_LIMITS.title}
            defaultValue={item?.title ?? ""}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <FieldError message={state.fieldErrors?.title} />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Slug</span>
          <input
            name="slug"
            required
            maxLength={PORTFOLIO_LIMITS.slug}
            defaultValue={item?.slug ?? ""}
            placeholder="project-slug"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <FieldError message={state.fieldErrors?.slug} />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Category</span>
          <input
            name="category"
            required
            maxLength={PORTFOLIO_LIMITS.category}
            defaultValue={item?.category ?? ""}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <FieldError message={state.fieldErrors?.category} />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-800">External URL</span>
          <input
            name="external_url"
            type="url"
            inputMode="url"
            defaultValue={item?.external_url ?? ""}
            placeholder="https://example.com"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <FieldError message={state.fieldErrors?.external_url} />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Description</span>
        <textarea
          name="description"
          required
          maxLength={PORTFOLIO_LIMITS.description}
          defaultValue={item?.description ?? ""}
          rows={6}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <FieldError message={state.fieldErrors?.description} />
      </label>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Image storage path</span>
          <input
            name="image_path"
            defaultValue={item?.image_path ?? ""}
            placeholder="portfolio/project-image.webp"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <FieldError message={state.fieldErrors?.image_path} />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Sort order</span>
          <input
            name="sort_order"
            type="number"
            min="0"
            step="1"
            defaultValue={item?.sort_order ?? 0}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <FieldError message={state.fieldErrors?.sort_order} />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm font-semibold text-slate-800">
        <input
          name="is_published"
          type="checkbox"
          defaultChecked={item?.is_published ?? false}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        Published on the public website
      </label>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
        <a
          href="/admin/portfolio"
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </a>
        <SubmitButton editing={editing} />
      </div>
    </form>
  );
}
