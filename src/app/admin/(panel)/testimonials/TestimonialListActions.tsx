"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  deleteTestimonial,
  reorderTestimonial,
  setTestimonialPublished,
  type TestimonialActionState,
} from "./actions";

function ActionButton({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  const { pending } = useFormStatus();
  const toneClass =
    tone === "danger"
      ? "border-red-300 text-red-700 hover:border-red-400 hover:bg-red-50"
      : "border-slate-300 text-slate-700 hover:border-blue-300 hover:bg-blue-50";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${toneClass}`}
    >
      {pending ? "..." : children}
    </button>
  );
}

function MutationError({ state }: { state: TestimonialActionState }) {
  if (!state.message) return null;
  return <p className="mt-2 text-xs text-red-600">{state.message}</p>;
}

export function PublishToggle({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const [state, formAction] = useActionState(setTestimonialPublished, {});

  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="is_published" value={String(!isPublished)} />
        <ActionButton>{isPublished ? "Unpublish" : "Publish"}</ActionButton>
      </form>
      <MutationError state={state} />
    </div>
  );
}

export function ReorderButtons({ id }: { id: string }) {
  const [upState, upAction] = useActionState(reorderTestimonial, {});
  const [downState, downAction] = useActionState(reorderTestimonial, {});

  return (
    <div>
      <div className="flex gap-2">
        <form action={upAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="direction" value="up" />
          <ActionButton>Up</ActionButton>
        </form>
        <form action={downAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="direction" value="down" />
          <ActionButton>Down</ActionButton>
        </form>
      </div>
      <MutationError state={upState} />
      <MutationError state={downState} />
    </div>
  );
}

export function DeleteButton({ id }: { id: string }) {
  const [state, formAction] = useActionState(deleteTestimonial, {});

  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="id" value={id} />
        <ActionButton tone="danger">Delete</ActionButton>
      </form>
      <MutationError state={state} />
    </div>
  );
}
