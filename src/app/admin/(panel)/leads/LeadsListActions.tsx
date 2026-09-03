"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteLeadAction,
  updateLeadStatusAction,
} from "@/app/admin/(panel)/leads/actions";
import { LEAD_STATUSES } from "@/app/lib/leads/validation";
import type { Lead } from "@/app/lib/leads/queries";

const statusColors: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-purple-50 text-purple-700 border-purple-200",
  qualified: "bg-amber-50 text-amber-700 border-amber-200",
  proposal: "bg-cyan-50 text-cyan-700 border-cyan-200",
  won: "bg-emerald-50 text-emerald-700 border-emerald-200",
  lost: "bg-red-50 text-red-700 border-red-200",
};

export function LeadsList({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleStatusChange = async (lead: Lead, status: string) => {
    if (status === lead.status) return;

    setUpdatingLeadId(lead.id);
    try {
      const result = await updateLeadStatusAction(lead.id, status);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to update status");
      }
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleDelete = async (lead: Lead) => {
    if (!confirm(`Are you sure you want to delete the lead from ${lead.name}?`)) {
      return;
    }

    setDeletingLeadId(lead.id);
    try {
      const result = await deleteLeadAction(lead.id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to delete lead");
      }
    } catch {
      alert("Failed to delete lead");
    } finally {
      setDeletingLeadId(null);
    }
  };

  return (
    <>
      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {leads.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-slate-900">No leads yet</h2>
            <p className="mt-2 text-sm text-slate-600">
              When customers submit the contact form, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Company</th>
                  <th className="px-6 py-4 font-semibold">Service</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Source</th>
                  <th className="px-6 py-4 font-semibold">Created</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="align-middle transition hover:bg-slate-50">
                    <td className="px-6 py-5"><p className="font-semibold text-slate-900">{lead.name}</p></td>
                    <td className="px-6 py-5 text-slate-600">
                      {lead.email ? <a href={`mailto:${lead.email}`} className="break-all text-blue-600 hover:underline">{lead.email}</a> : <EmptyValue />}
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {lead.phone ? <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">{lead.phone}</a> : <EmptyValue />}
                    </td>
                    <td className="px-6 py-5 text-slate-600">{lead.company || <EmptyValue />}</td>
                    <td className="px-6 py-5 text-slate-600">{lead.service || <EmptyValue />}</td>
                    <td className="px-6 py-5">
                      <select
                        value={lead.status}
                        onChange={(event) => handleStatusChange(lead, event.target.value)}
                        disabled={updatingLeadId === lead.id}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${statusColors[lead.status] || "bg-slate-50 text-slate-700"} disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {LEAD_STATUSES.map((status) => (
                          <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {lead.source === "website_contact" ? <span className="inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">Website</span> : lead.source || <EmptyValue />}
                    </td>
                    <td className="px-6 py-5 text-xs text-slate-600">
                      {new Date(lead.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button onClick={() => setSelectedLead(lead)} className="rounded-lg border border-blue-300 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50">Details</button>
                        <button onClick={() => handleDelete(lead)} disabled={deletingLeadId === lead.id} className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
                          {deletingLeadId === lead.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedLead && <LeadDetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </>
  );
}

function EmptyValue() {
  return <span className="text-slate-400">—</span>;
}

function LeadDetailsModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
        <div className="border-b border-slate-200 px-6 py-4"><h2 className="text-lg font-semibold text-slate-900">Lead Details</h2></div>
        <div className="max-h-96 space-y-4 overflow-y-auto px-6 py-4">
          <Detail label="Name"><p className="mt-1 font-semibold text-slate-900">{lead.name}</p></Detail>
          {lead.email && <Detail label="Email"><a href={`mailto:${lead.email}`} className="mt-1 block font-semibold text-blue-600 hover:underline">{lead.email}</a></Detail>}
          {lead.phone && <Detail label="Phone"><a href={`tel:${lead.phone}`} className="mt-1 block font-semibold text-blue-600 hover:underline">{lead.phone}</a></Detail>}
          {lead.company && <Detail label="Company"><p className="mt-1 font-semibold text-slate-900">{lead.company}</p></Detail>}
          {lead.service && <Detail label="Service Interested In"><p className="mt-1 font-semibold text-slate-900">{lead.service}</p></Detail>}
          <Detail label="Status"><p className="mt-1 font-semibold text-slate-900">{lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</p></Detail>
          {lead.source && <Detail label="Source"><p className="mt-1 font-semibold text-slate-900">{lead.source}</p></Detail>}
          <Detail label="Created At"><p className="mt-1 font-semibold text-slate-900">{new Date(lead.created_at).toLocaleString()}</p></Detail>
          {lead.message && <Detail label="Message"><p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 px-4 py-3 text-slate-700">{lead.message}</p></Detail>}
        </div>
        <div className="border-t border-slate-200 px-6 py-4"><button onClick={onClose} className="rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-300">Close</button></div>
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>{children}</div>;
}
