import Link from "next/link";
import { requirePermission } from "@/app/lib/auth/authorize";
import { getAdminPortfolioServiceOptions } from "@/app/lib/portfolio/queries";
import PortfolioForm from "../PortfolioForm";

export default async function NewPortfolioPage() {
  await requirePermission("portfolio.manage");
  const services = await getAdminPortfolioServiceOptions();

  return (
    <section className="px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/portfolio"
          className="text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          Back to portfolio
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          Add portfolio item
        </h1>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <PortfolioForm services={services} />
        </div>
      </div>
    </section>
  );
}
