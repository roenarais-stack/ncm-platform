"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/app/lib/auth/authorize";
import { createClient } from "@/app/lib/supabase/server";
import { validateServiceForm, type ValidationErrors } from "@/app/lib/services/validation";

export interface ServiceActionState {
  message?: string;
  fieldErrors?: ValidationErrors;
}

function getDatabaseErrorMessage(code?: string) {
  if (code === "23514") return "One or more values failed database validation.";
  return "The service could not be saved.";
}

export async function saveService(
  _previousState: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  await requirePermission("services.manage");

  const { errors, data } = validateServiceForm(formData);
  if (!data) return { fieldErrors: errors };

  const id = String(formData.get("id") ?? "").trim();
  const serviceData = {
    title: data.title,
    slug: data.slug,
    description: data.description,
    is_published: data.is_published,
    sort_order: data.sort_order,
  };
  const supabase = await createClient();
  const query = id
    ? supabase.from("services").update(serviceData).eq("id", id)
    : supabase.from("services").insert(serviceData);
  const { error } = await query;

  if (error) return { message: getDatabaseErrorMessage(error.code) };

  revalidatePath("/");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function setServicePublished(
  _previousState: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  await requirePermission("services.manage");

  const id = String(formData.get("id") ?? "").trim();
  const isPublished = formData.get("is_published") === "true";
  if (!id) return { message: "The service could not be found." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) return { message: "The publication status could not be changed." };

  revalidatePath("/");
  revalidatePath("/admin/services");
  return {};
}

export async function reorderService(
  _previousState: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  await requirePermission("services.manage");

  const id = String(formData.get("id") ?? "").trim();
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (!id) return { message: "The service could not be found." };

  const supabase = await createClient();
  const { data: services, error } = await supabase
    .from("services")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !services) {
    return { message: "The service order could not be loaded." };
  }

  const index = services.findIndex((service) => service.id === id);
  const neighborIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || neighborIndex < 0 || neighborIndex >= services.length) {
    return {};
  }

  const current = services[index];
  const neighbor = services[neighborIndex];
  const results = await Promise.all([
    supabase
      .from("services")
      .update({ sort_order: neighbor.sort_order })
      .eq("id", current.id),
    supabase
      .from("services")
      .update({ sort_order: current.sort_order })
      .eq("id", neighbor.id),
  ]);

  if (results.some((result) => result.error)) {
    return { message: "The service order could not be changed." };
  }

  revalidatePath("/");
  revalidatePath("/admin/services");
  return {};
}
