import { requirePermission } from "@/app/lib/auth/authorize";
import { getAdminLeads } from "@/app/lib/leads/queries";
import { LeadsList } from "./LeadsListActions";

export default async function AdminLeadsPage() {
  await requirePermission("leads.view");
  const leads = await getAdminLeads();

  return (
    <section className="px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Lead Management
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Manage leads
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              View and manage customer inquiries from your website contact form.
            </p>
          </div>
        </div>

        <LeadsList leads={leads} />

        {leads.length > 0 && (
          <div className="mt-6 text-sm text-slate-600">
            <p>
              Showing <strong>{leads.length}</strong> lead
              {leads.length !== 1 ? "s" : ""} (newest first)
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
