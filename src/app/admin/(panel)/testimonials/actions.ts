"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/app/lib/auth/authorize";
import { createClient } from "@/app/lib/supabase/server";
import {
  validateTestimonialForm,
  type ValidationErrors,
} from "@/app/lib/testimonials/validation";

export interface TestimonialActionState {
  message?: string;
  fieldErrors?: ValidationErrors;
}

function revalidateTestimonials() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function saveTestimonial(
  _previousState: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  await requirePermission("testimonials.manage");

  const { data, errors } = validateTestimonialForm(formData);
  if (!data) return { fieldErrors: errors };

  const id = String(formData.get("id") ?? "").trim();
  const supabase = await createClient();
  const query = id
    ? supabase.from("testimonials").update(data).eq("id", id)
    : supabase.from("testimonials").insert(data);
  const { error } = await query;

  if (error) return { message: "The testimonial could not be saved." };

  revalidateTestimonials();
  redirect("/admin/testimonials");
}

export async function setTestimonialPublished(
  _previousState: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  await requirePermission("testimonials.manage");

  const id = String(formData.get("id") ?? "").trim();
  const isPublished = formData.get("is_published") === "true";
  if (!id) return { message: "The testimonial could not be found." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) return { message: "The publication status could not be changed." };

  revalidateTestimonials();
  return {};
}

export async function reorderTestimonial(
  _previousState: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  await requirePermission("testimonials.manage");

  const id = String(formData.get("id") ?? "").trim();
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (!id) return { message: "The testimonial could not be found." };

  const supabase = await createClient();
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !testimonials) {
    return { message: "The testimonial order could not be loaded." };
  }

  const index = testimonials.findIndex((testimonial) => testimonial.id === id);
  const neighborIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || neighborIndex < 0 || neighborIndex >= testimonials.length) {
    return {};
  }

  const current = testimonials[index];
  const neighbor = testimonials[neighborIndex];
  const results = await Promise.all([
    supabase
      .from("testimonials")
      .update({ sort_order: neighbor.sort_order })
      .eq("id", current.id),
    supabase
      .from("testimonials")
      .update({ sort_order: current.sort_order })
      .eq("id", neighbor.id),
  ]);

  if (results.some((result) => result.error)) {
    return { message: "The testimonial order could not be changed." };
  }

  revalidateTestimonials();
  return {};
}

export async function deleteTestimonial(
  _previousState: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  await requirePermission("testimonials.manage");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { message: "The testimonial could not be found." };

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) return { message: "The testimonial could not be deleted." };

  revalidateTestimonials();
  return {};
}
