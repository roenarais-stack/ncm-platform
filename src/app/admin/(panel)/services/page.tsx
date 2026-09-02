import Link from "next/link";
import { requirePermission } from "@/app/lib/auth/authorize";
import { getAdminServices } from "@/app/lib/services/queries";
import {
  PublishToggle,
  ReorderButtons,
} from "./ServiceListActions";

export default async function AdminServicesPage() {
  await requirePermission("services.manage");
  const services = await getAdminServices();

  return (
    <section className="px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Services
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Manage services
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Keep published services visible and prepare unpublished services safely.
            </p>
          </div>
          <Link
            href="/admin/services/new"
            className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add service
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {services.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-slate-900">
                No services yet
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Create the first service when its content is ready for review.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Service</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Order</th>
                    <th className="px-6 py-4 font-semibold">Updated</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((service) => (
                    <tr key={service.id} className="align-top">
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">{service.title}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            service.is_published
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {service.is_published ? "Published" : "Unpublished"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-700">{service.sort_order}</td>
                      <td className="px-6 py-5 text-slate-600">
                        {new Date(service.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap justify-end gap-2">
                          <ReorderButtons id={service.id} />
                          <PublishToggle
                            id={service.id}
                            isPublished={service.is_published}
                          />
                          <Link
                            href={`/admin/services/${service.id}/edit`}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
