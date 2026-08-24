"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  reorderPortfolioItem,
  setPortfolioPublished,
  type PortfolioActionState,
} from "./actions";

function ActionButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "..." : children}
    </button>
  );
}

function MutationError({ state }: { state: PortfolioActionState }) {
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
  const [state, formAction] = useActionState(setPortfolioPublished, {});

  return (
    <div>
      <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input
        type="hidden"
        name="is_published"
        value={String(!isPublished)}
      />
      <ActionButton>{isPublished ? "Unpublish" : "Publish"}</ActionButton>
      </form>
      <MutationError state={state} />
    </div>
  );
}

export function ReorderButtons({ id }: { id: string }) {
  const [upState, upAction] = useActionState(reorderPortfolioItem, {});
  const [downState, downAction] = useActionState(reorderPortfolioItem, {});

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
