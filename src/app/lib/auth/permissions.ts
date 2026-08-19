export type UserRole = "admin" | "super_admin";

export type Permission =
  | "dashboard.view"
  | "website.manage"
  | "portfolio.manage"
  | "services.manage"
  | "testimonials.manage"
  | "leads.view"
  | "team.manage"
  | "permissions.manage"
  | "settings.manage"
  | "security.manage";

const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  super_admin: [
    "dashboard.view",
    "website.manage",
    "portfolio.manage",
    "services.manage",
    "testimonials.manage",
    "leads.view",
    "team.manage",
    "permissions.manage",
    "settings.manage",
    "security.manage",
  ],

  admin: [
    "dashboard.view",
    "portfolio.manage",
    "services.manage",
    "testimonials.manage",
    "leads.view",
  ],
};

export function hasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissions(
  role: UserRole,
): readonly Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function isValidRole(
  role: string | null | undefined,
): role is UserRole {
  return role === "admin" || role === "super_admin";
}