import { createClient } from "@/app/lib/supabase/server";
import { requirePermission } from "@/app/lib/auth/authorize";
import type { Database } from "@/app/lib/supabase/database.types";

export type Service =
  Database["public"]["Tables"]["services"]["Row"];

const serviceColumns =
  "id, title, slug, description, is_published, sort_order, created_at, updated_at";

export async function getPublishedServices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(serviceColumns)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<Service[]>();

  if (error) throw new Error("Unable to load published services.");

  return data ?? [];
}

export async function getAdminServices() {
  await requirePermission("services.manage");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(serviceColumns)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<Service[]>();

  if (error) throw new Error("Unable to load services.");

  return data ?? [];
}

export async function getService(id: string) {
  await requirePermission("services.manage");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(serviceColumns)
    .eq("id", id)
    .single()
    .returns<Service>();

  if (error || !data) return null;

  return data;
}
