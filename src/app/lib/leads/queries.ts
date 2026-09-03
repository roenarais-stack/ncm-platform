import { requirePermission } from "@/app/lib/auth/authorize";
import type { Database } from "@/app/lib/supabase/database.types";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { createClient } from "@/app/lib/supabase/server";
import { isLeadStatus, type LeadFormData } from "@/app/lib/leads/validation";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];

const leadColumns =
  "id, name, email, phone, company, service, message, status, source, assigned_to, created_at, updated_at";

export async function getAdminLeads() {
  await requirePermission("leads.view");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(leadColumns)
    .order("created_at", { ascending: false })
    .returns<Lead[]>();

  if (error) throw new Error("Unable to load leads.");

  return data ?? [];
}

export async function getLeadById(id: string) {
  await requirePermission("leads.view");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(leadColumns)
    .eq("id", id)
    .single()
    .returns<Lead>();

  if (error || !data) {
    throw new Error("Lead not found.");
  }

  return data;
}

export async function createLead(
  formData: LeadFormData,
): Promise<Lead> {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      service: formData.service,
      message: formData.message,
      status: "new",
      source: "website_contact",
      assigned_to: null,
    })
    .select(leadColumns)
    .single()
    .returns<Lead>();

  if (error) {
    throw new Error("Failed to create lead. Please try again.");
  }

  if (!data) {
    throw new Error("Failed to create lead. Please try again.");
  }

  return data;
}

export async function updateLeadStatus(
  id: string,
  status: string,
): Promise<Lead> {
  await requirePermission("leads.view");

  if (!isLeadStatus(status)) {
    throw new Error("Invalid status value.");
  }

  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select(leadColumns)
    .single()
    .returns<Lead>();

  if (error || !data) {
    throw new Error("Failed to update lead status.");
  }

  return data;
}

export async function deleteLead(id: string): Promise<void> {
  await requirePermission("leads.view");

  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Failed to delete lead.");
  }
}
