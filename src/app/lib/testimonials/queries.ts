import { requirePermission } from "@/app/lib/auth/authorize";
import { createClient } from "@/app/lib/supabase/server";
import type { Database } from "@/app/lib/supabase/database.types";

export type Testimonial =
  Database["public"]["Tables"]["testimonials"]["Row"];

const testimonialColumns =
  "id, client_name, company, review, avatar_url, is_published, sort_order, created_at, updated_at";

export async function getPublishedTestimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(testimonialColumns)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<Testimonial[]>();

  if (error) throw new Error("Unable to load published testimonials.");

  return data ?? [];
}

export async function getAdminTestimonials() {
  await requirePermission("testimonials.manage");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(testimonialColumns)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<Testimonial[]>();

  if (error) throw new Error("Unable to load testimonials.");

  return data ?? [];
}

export async function getTestimonial(id: string) {
  await requirePermission("testimonials.manage");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(testimonialColumns)
    .eq("id", id)
    .single()
    .returns<Testimonial>();

  if (error || !data) return null;

  return data;
}
