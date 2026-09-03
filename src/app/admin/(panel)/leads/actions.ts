"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { isIP } from "node:net";
import {
  validateLeadForm,
  getHoneypotValue,
  type LeadValidationErrors,
} from "@/app/lib/leads/validation";
import { createLead, updateLeadStatus, deleteLead } from "@/app/lib/leads/queries";

const RATE_LIMIT_FALLBACK_COOKIE = "ncm_lead_rate_limit";
const RATE_LIMIT_FALLBACK_COOKIE_MAX_AGE = 60 * 60;

// V1 only: this map is local to one Node.js process. It does not provide a
// shared limit across serverless invocations, containers, or multiple servers.
const ipSubmissions = new Map<string, number[]>();

function checkRateLimit(ip: string, maxAttempts: number = 5, windowMs: number = 3600000): boolean {
  const now = Date.now();
  const submissions = ipSubmissions.get(ip) ?? [];
  
  // Remove submissions outside the time window
  const recentSubmissions = submissions.filter(time => now - time < windowMs);
  
  if (recentSubmissions.length >= maxAttempts) {
    return false;
  }
  
  // Add current submission
  recentSubmissions.push(now);
  ipSubmissions.set(ip, recentSubmissions);
  
  return true;
}

function getIpFromHeader(value: string | null): string | null {
  if (!value) return null;

  // A trusted proxy may append a chain. The left-most value is the original
  // client address only when that proxy is configured to overwrite this header.
  const candidate = value.split(",", 1)[0]?.trim();
  return candidate && isIP(candidate) ? candidate : null;
}

function getTrustedClientIp(requestHeaders: Headers): string | null {
  if (process.env.VERCEL === "1") {
    // Vercel overwrites these headers, including when Vercel is behind a proxy.
    return (
      getIpFromHeader(requestHeaders.get("x-vercel-forwarded-for")) ??
      getIpFromHeader(requestHeaders.get("x-forwarded-for"))
    );
  }

  if (process.env.NCM_TRUST_PROXY === "true") {
    // Self-hosted deployments must set this only when their reverse proxy
    // strips client-supplied forwarding headers and writes X-Forwarded-For.
    return getIpFromHeader(requestHeaders.get("x-forwarded-for"));
  }

  return null;
}

function createRateLimitFallbackKey(): string {
  return `browser:${crypto.randomUUID()}`;
}

export async function submitLeadForm(
  formData: FormData,
): Promise<{
  success: boolean;
  message?: string;
  errors?: LeadValidationErrors;
}> {
  try {
    // Check honeypot
    const honeypot = getHoneypotValue(formData);
    if (honeypot) {
      // Silently fail to avoid revealing honeypot to attackers
      return { success: true };
    }

    const requestHeaders = await headers();
    const clientIp = getTrustedClientIp(requestHeaders);
    const cookieStore = await cookies();
    let rateLimitKey = clientIp ? `ip:${clientIp}` : cookieStore.get(RATE_LIMIT_FALLBACK_COOKIE)?.value;

    if (!rateLimitKey) {
      // If no trusted IP is available, do not place every visitor in a shared
      // "unknown" bucket. This is best-effort only: clearing cookies bypasses it.
      rateLimitKey = createRateLimitFallbackKey();
      cookieStore.set(RATE_LIMIT_FALLBACK_COOKIE, rateLimitKey, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: RATE_LIMIT_FALLBACK_COOKIE_MAX_AGE,
        path: "/",
      });
    }

    // Check rate limit
    if (!checkRateLimit(rateLimitKey)) {
      return {
        success: false,
        message: "Too many submissions. Please try again later.",
      };
    }

    // Validate form
    const { data, errors } = validateLeadForm(formData);

    if (!data) {
      return {
        success: false,
        errors,
      };
    }

    // Create lead in database
    await createLead(data);

    return {
      success: true,
      message: "Thank you! We've received your message and will be in touch soon.",
    };
  } catch (err) {
    console.error("Lead submission error:", err instanceof Error ? err.message : err);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function updateLeadStatusAction(
  id: string,
  status: string,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    await updateLeadStatus(id, status);
    revalidatePath("/admin/leads");
    return {
      success: true,
      message: "Lead status updated successfully.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update lead.",
    };
  }
}

export async function deleteLeadAction(id: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    await deleteLead(id);
    revalidatePath("/admin/leads");
    return {
      success: true,
      message: "Lead deleted successfully.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete lead.",
    };
  }
}
