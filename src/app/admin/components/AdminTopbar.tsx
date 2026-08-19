"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

interface AdminTopbarProps {
  email: string;
  role: string;
}

export default function AdminTopbar({
  email,
  role,
}: AdminTopbarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        return;
      }

      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const formattedRole = role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex min-h-20 items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            NCM Admin
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Management Dashboard
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">
              {email}
            </p>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
              {formattedRole}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}