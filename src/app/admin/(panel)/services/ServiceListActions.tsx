"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  setServicePublished,
  reorderService,
  type ServiceActionState,
} from "./actions";

const initialState: ServiceActionState = {};

function FormButton({
  actionName,
  pending,
  children,
}: {
  actionName: string;
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      formAction={async (fd) => {
        fd.set("action", actionName);
      }}
      disabled={pending}
      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function PublishToggle({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const [, formAction] = useActionState(setServicePublished, initialState);
  const { pending } = useFormStatus();

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="is_published" value={String(!isPublished)} />
      <FormButton actionName="publish" pending={pending}>
        {isPublished ? "Unpublish" : "Publish"}
      </FormButton>
    </form>
  );
}

export function ReorderButtons({ id }: { id: string }) {
  const [, formAction] = useActionState(reorderService, initialState);
  const { pending } = useFormStatus();

  return (
    <form action={formAction} className="flex gap-2">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        name="direction"
        value="up"
        disabled={pending}
        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Up
      </button>
      <button
        type="submit"
        name="direction"
        value="down"
        disabled={pending}
        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Down
      </button>
    </form>
  );
}
