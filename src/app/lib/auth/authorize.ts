import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import {
  hasPermission,
  isValidRole,
  type Permission,
  type UserRole,
} from "@/app/lib/auth/permissions";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (
    error ||
    !profile ||
    !profile.is_active ||
    !isValidRole(profile.role)
  ) {
    redirect("/admin/login");
  }

  return {
    user,
    profile: {
      role: profile.role as UserRole,
      is_active: profile.is_active,
    },
  };
}

export async function requirePermission(
  permission: Permission,
) {
  const { user, profile } = await getCurrentUser();

  if (!hasPermission(profile.role, permission)) {
    redirect("/admin");
  }

  return {
    user,
    profile,
  };
}

export async function requireRole(
  role: UserRole,
) {
  const { user, profile } = await getCurrentUser();

  if (profile.role !== role) {
    redirect("/admin");
  }

  return {
    user,
    profile,
  };
}