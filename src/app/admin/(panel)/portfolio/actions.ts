"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/app/lib/auth/authorize";
import { createClient } from "@/app/lib/supabase/server";
import { validatePortfolioForm } from "@/app/lib/portfolio/validation";

export interface PortfolioActionState {
  message?: string;
  fieldErrors?: Record<string, string>;
}

function getDatabaseErrorMessage(code?: string) {
  if (code === "23505") return "That slug is already in use.";
  if (code === "23514") return "One or more values failed database validation.";
  return "The portfolio item could not be saved.";
}

export async function savePortfolioItem(
  _previousState: PortfolioActionState,
  formData: FormData,
): Promise<PortfolioActionState> {
  await requirePermission("portfolio.manage");

  const { errors, data } = validatePortfolioForm(formData);
  if (!data) return { fieldErrors: errors };

  const id = String(formData.get("id") ?? "").trim();
  const supabase = await createClient();
  const query = id
    ? supabase.from("portfolio_items").update(data).eq("id", id)
    : supabase.from("portfolio_items").insert(data);
  const { error } = await query;

  if (error) return { message: getDatabaseErrorMessage(error.code) };

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}

export async function setPortfolioPublished(
  _previousState: PortfolioActionState,
  formData: FormData,
): Promise<PortfolioActionState> {
  await requirePermission("portfolio.manage");

  const id = String(formData.get("id") ?? "").trim();
  const isPublished = formData.get("is_published") === "true";
  if (!id) return { message: "The portfolio item could not be found." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_items")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) return { message: "The publication status could not be changed." };

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return {};
}

export async function reorderPortfolioItem(
  _previousState: PortfolioActionState,
  formData: FormData,
): Promise<PortfolioActionState> {
  await requirePermission("portfolio.manage");

  const id = String(formData.get("id") ?? "").trim();
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (!id) return { message: "The portfolio item could not be found." };

  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("portfolio_items")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !items) {
    return { message: "The portfolio order could not be loaded." };
  }

  const index = items.findIndex((item) => item.id === id);
  const neighborIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || neighborIndex < 0 || neighborIndex >= items.length) {
    return {};
  }

  const current = items[index];
  const neighbor = items[neighborIndex];
  const results = await Promise.all([
    supabase
      .from("portfolio_items")
      .update({ sort_order: neighbor.sort_order })
      .eq("id", current.id),
    supabase
      .from("portfolio_items")
      .update({ sort_order: current.sort_order })
      .eq("id", neighbor.id),
  ]);

  if (results.some((result) => result.error)) {
    return { message: "The portfolio order could not be changed." };
  }

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return {};
}
