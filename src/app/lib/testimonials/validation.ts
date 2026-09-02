export interface TestimonialFormData {
  client_name: string;
  company: string | null;
  review: string;
  avatar_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface ValidationErrors {
  client_name?: string;
  review?: string;
  avatar_url?: string;
  sort_order?: string;
}

function trimOptional(value: FormDataEntryValue | null) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

export function validateTestimonialForm(
  formData: FormData,
): { data: TestimonialFormData | null; errors: ValidationErrors } {
  const errors: ValidationErrors = {};
  const clientName = String(formData.get("client_name") ?? "").trim();
  const company = trimOptional(formData.get("company"));
  const review = String(formData.get("review") ?? "").trim();
  const avatarUrl = trimOptional(formData.get("avatar_url"));
  const sortOrder = Number.parseInt(
    String(formData.get("sort_order") ?? "0"),
    10,
  );
  const isPublished = formData.get("is_published") === "on";

  if (!clientName) errors.client_name = "Client name is required.";
  if (!review) errors.review = "Review is required.";

  if (avatarUrl) {
    try {
      const url = new URL(avatarUrl);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errors.avatar_url = "Avatar URL must use HTTP or HTTPS.";
      }
    } catch {
      errors.avatar_url = "Avatar URL must be a valid URL.";
    }
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    errors.sort_order = "Sort order must be a non-negative integer.";
  }

  if (Object.keys(errors).length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      client_name: clientName,
      company,
      review,
      avatar_url: avatarUrl,
      is_published: isPublished,
      sort_order: sortOrder,
    },
    errors: {},
  };
}
