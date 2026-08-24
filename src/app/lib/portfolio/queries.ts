import { createClient } from "@/app/lib/supabase/server";
import { requirePermission } from "@/app/lib/auth/authorize";
import type { Database } from "@/app/lib/supabase/database.types";

export type PortfolioItem =
  Database["public"]["Tables"]["portfolio_items"]["Row"];

const portfolioColumns =
  "id, title, slug, category, description, image_path, external_url, is_published, sort_order, created_at, updated_at";

export async function getPublishedPortfolioItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select(portfolioColumns)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error("Unable to load published portfolio items.");

  return data as PortfolioItem[];
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

  return data as PortfolioItem[];
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

  return data as PortfolioItem;
}
