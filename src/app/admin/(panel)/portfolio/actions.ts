"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/app/lib/auth/authorize";
import { createClient } from "@/app/lib/supabase/server";
import { validatePortfolioForm } from "@/app/lib/portfolio/validation";
import type { Database } from "@/app/lib/supabase/database.types";

type PortfolioItemService =
  Database["public"]["Tables"]["portfolio_item_services"]["Row"];

export interface PortfolioActionState {
  message?: string;
  fieldErrors?: Record<string, string>;
}

function getDatabaseErrorMessage(code?: string, message?: string) {
  if (code === "23505" && message?.includes("featured_slot")) {
    return "That featured slot is already in use. Choose another slot or None.";
  }
  if (code === "23505") return "That slug is already in use.";
  if (code === "23514") {
    return "Clear the featured slot before unpublishing this project.";
  }
  return "The portfolio item could not be saved.";
}

async function validateSelectedServices(serviceIds: string[], portfolioItemId?: string) {
  if (serviceIds.length === 0) return true;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id")
    .in("id", serviceIds)
    .eq("is_published", true)
    .returns<{ id: string }[]>();

  if (error) return false;

  const publishedIds = new Set(data?.map((service) => service.id) ?? []);
  if (portfolioItemId) {
    const { data: links, error: linksError } = await supabase
      .from("portfolio_item_services")
      .select("service_id")
      .eq("portfolio_item_id", portfolioItemId)
      .in("service_id", serviceIds)
      .returns<Pick<PortfolioItemService, "service_id">[]>();
    if (linksError) return false;
    links?.forEach((link) => publishedIds.add(link.service_id));
  }

  return publishedIds.size === serviceIds.length;
}

async function synchronizePortfolioServices(
  portfolioItemId: string,
  serviceIds: string[],
) {
  const supabase = await createClient();
  const { data: existingLinks, error: existingError } = await supabase
    .from("portfolio_item_services")
    .select("service_id")
    .eq("portfolio_item_id", portfolioItemId)
    .returns<Pick<PortfolioItemService, "service_id">[]>();

  if (existingError) return false;

  const existingIds = new Set(existingLinks?.map((link) => link.service_id) ?? []);
  const selectedIds = new Set(serviceIds);
  const newLinks = serviceIds
    .filter((serviceId) => !existingIds.has(serviceId))
    .map((service_id) => ({ portfolio_item_id: portfolioItemId, service_id }));
  const removedIds = [...existingIds].filter((serviceId) => !selectedIds.has(serviceId));

  if (newLinks.length > 0) {
    const { error } = await supabase.from("portfolio_item_services").insert(newLinks);
    if (error) return false;
  }

  if (removedIds.length > 0) {
    const { error } = await supabase
      .from("portfolio_item_services")
      .delete()
      .eq("portfolio_item_id", portfolioItemId)
      .in("service_id", removedIds);
    if (error) return false;
  }

  return true;
}

export async function savePortfolioItem(
  _previousState: PortfolioActionState,
  formData: FormData,
): Promise<PortfolioActionState> {
  await requirePermission("portfolio.manage");

  const { errors, data } = validatePortfolioForm(formData);
  if (!data) return { fieldErrors: errors };

  const serviceIds = [...new Set(
    formData
      .getAll("service_ids")
      .filter((value): value is string => typeof value === "string" && value.length > 0),
  )];
  const id = String(formData.get("id") ?? "").trim();
  if (!(await validateSelectedServices(serviceIds, id || undefined))) {
    return { fieldErrors: { service_ids: "Choose only currently published services." } };
  }

  const supabase = await createClient();
  let portfolioItemId = id;

  if (id) {
    const { error } = await supabase.from("portfolio_items").update(data).eq("id", id);
    if (error) return { message: getDatabaseErrorMessage(error.code, error.message) };
  } else {
    const { data: createdItem, error } = await supabase
      .from("portfolio_items")
      .insert(data)
      .select("id")
      .single()
      .returns<{ id: string }>();
    if (error || !createdItem) {
      return { message: getDatabaseErrorMessage(error?.code, error?.message) };
    }
    portfolioItemId = createdItem.id;
  }

  if (!(await synchronizePortfolioServices(portfolioItemId, serviceIds))) {
    return { message: "The project was saved, but its services could not be updated. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/portfolio/[slug]", "page");
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

  if (error) return { message: getDatabaseErrorMessage(error.code, error.message) };

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/portfolio/[slug]", "page");
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
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
  return {};
}
