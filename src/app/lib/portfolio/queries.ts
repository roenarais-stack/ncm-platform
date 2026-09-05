import { createClient } from "@/app/lib/supabase/server";
import { requirePermission } from "@/app/lib/auth/authorize";
import type { Database } from "@/app/lib/supabase/database.types";

export type PortfolioItem =
  Database["public"]["Tables"]["portfolio_items"]["Row"];
export type PortfolioItemService =
  Database["public"]["Tables"]["portfolio_item_services"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];

type PublishedPortfolioServiceLink = {
  services: Service | null;
};

const portfolioColumns =
  "id, title, slug, category, description, image_path, external_url, is_published, sort_order, featured_slot, overview, challenge, solution, outcome, created_at, updated_at";

const serviceColumns =
  "id, title, slug, description, is_published, sort_order, created_at, updated_at";

export async function getPublishedPortfolioItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select(portfolioColumns)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error("Unable to load published portfolio items.");

  return data ?? [];
}

export async function getHomepagePortfolioItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select(portfolioColumns)
    .eq("is_published", true)
    .not("featured_slot", "is", null)
    .order("featured_slot", { ascending: true })
    .limit(3);

  if (error) throw new Error("Unable to load homepage portfolio items.");

  return data ?? [];
}

export async function getPublishedPortfolioItemBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select(portfolioColumns)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw new Error("Unable to load portfolio item.");

  return data;
}

export async function getPublishedPortfolioItemServices(
  portfolioItemId: string,
): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_item_services")
    .select(`services!inner(${serviceColumns})`)
    .eq("portfolio_item_id", portfolioItemId)
    .eq("services.is_published", true)
    .order("sort_order", { referencedTable: "services", ascending: true })
    .order("created_at", { referencedTable: "services", ascending: false })
    .returns<PublishedPortfolioServiceLink[]>();

  if (error) throw new Error("Unable to load project services.");

  return (data ?? []).flatMap((link) => (link.services ? [link.services] : []));
}

export async function getAdminPortfolioItems() {
  await requirePermission("portfolio.manage");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select(portfolioColumns)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error("Unable to load portfolio items.");

  return data ?? [];
}

export async function getPortfolioItem(id: string) {
  await requirePermission("portfolio.manage");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select(portfolioColumns)
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return data;
}

export async function getAdminPortfolioServiceOptions(): Promise<Service[]> {
  await requirePermission("portfolio.manage");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(serviceColumns)
    .order("is_published", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<Service[]>();

  if (error) throw new Error("Unable to load service options.");

  return data ?? [];
}

export async function getAdminPortfolioServiceIds(
  portfolioItemId: string,
): Promise<string[]> {
  await requirePermission("portfolio.manage");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_item_services")
    .select("service_id")
    .eq("portfolio_item_id", portfolioItemId)
    .returns<Pick<PortfolioItemService, "service_id">[]>();

  if (error) throw new Error("Unable to load linked services.");

  return data?.map((link) => link.service_id) ?? [];
}
