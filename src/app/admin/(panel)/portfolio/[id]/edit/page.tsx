import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/app/lib/auth/authorize";
import { getPortfolioItem } from "@/app/lib/portfolio/queries";
import PortfolioForm from "../../PortfolioForm";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("portfolio.manage");
  const { id } = await params;
  const item = await getPortfolioItem(id);

  if (!item) notFound();

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
          Edit portfolio item
        </h1>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <PortfolioForm item={item} />
        </div>
      </div>
    </section>
  );
}
