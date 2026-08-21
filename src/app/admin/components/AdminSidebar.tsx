"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getPermissions,
  type Permission,
  type UserRole,
} from "@/app/lib/auth/permissions";

interface AdminSidebarProps {
  role: UserRole;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    permission: "dashboard.view",
  },
  {
    label: "Website Content",
    href: "/admin/content",
    permission: "website.manage",
  },
  {
    label: "Portfolio",
    href: "/admin/portfolio",
    permission: "portfolio.manage",
  },
  {
    label: "Services",
    href: "/admin/services",
    permission: "services.manage",
  },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    permission: "testimonials.manage",
  },
  {
    label: "Leads",
    href: "/admin/leads",
    permission: "leads.view",
  },
  {
    label: "Team",
    href: "/admin/team",
    permission: "team.manage",
  },
  {
    label: "Permissions",
    href: "/admin/permissions",
    permission: "permissions.manage",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    permission: "settings.manage",
  },
  {
    label: "Security",
    href: "/admin/security",
    permission: "security.manage",
  },
] satisfies ReadonlyArray<{
  label: string;
  href: string;
  permission: Permission;
}>;

export default function AdminSidebar({
  role,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const permissions = getPermissions(role);

  const visibleItems = navItems.filter((item) =>
    permissions.includes(item.permission),
  );

  return (
    <aside className="w-64 shrink-0 bg-slate-950 text-white">
      <div className="flex min-h-screen flex-col">
        <div className="border-b border-white/10 px-6 py-6">
          <div className="text-2xl font-bold tracking-tight text-blue-400">
            NCM
          </div>

          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            {role === "super_admin" ? "Super Admin" : "Admin Panel"}
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {visibleItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-6 py-5">
          <p className="text-xs leading-5 text-slate-500">
            NCM Platform
            <br />
            Admin Management System
          </p>
        </div>
      </div>
    </aside>
  );
}