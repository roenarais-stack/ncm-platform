import type { ReactNode } from "react";

import { getCurrentUser } from "@/app/lib/auth/authorize";
import AdminSidebar from "@/app/admin/components/AdminSidebar";
import AdminTopbar from "@/app/admin/components/AdminTopbar";

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, profile } = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <AdminSidebar role={profile.role} />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar
            email={user.email ?? ""}
            role={profile.role}
          />

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}