export const SERVICE_LIMITS = {
  title: 120,
  description: 2000,
};

export interface ServiceFormData {
  title: string;
  slug: string;
  description: string;
  is_published: boolean;
  sort_order: number;
}

export interface ValidationErrors {
  title?: string;
  slug?: string;
  description?: string;
  sort_order?: string;
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateServiceForm(
  formData: FormData,
): { data: ServiceFormData | null; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length > SERVICE_LIMITS.title) {
    errors.title = `Title must not exceed ${SERVICE_LIMITS.title} characters.`;
  }

  const slug = normalizeSlug(String(formData.get("slug") ?? ""));
  if (!slug) {
    errors.slug = "A valid slug is required.";
  }

  const description = String(formData.get("description") ?? "").trim();
  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length > SERVICE_LIMITS.description) {
    errors.description = `Description must not exceed ${SERVICE_LIMITS.description} characters.`;
  }

  const sortOrderStr = String(formData.get("sort_order") ?? "0").trim();
  const sortOrder = parseInt(sortOrderStr, 10);
  if (Number.isNaN(sortOrder) || sortOrder < 0) {
    errors.sort_order = "Sort order must be a non-negative integer.";
  }

  const isPublished = formData.get("is_published") === "on";

  if (Object.keys(errors).length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      title,
      slug,
      description,
      is_published: isPublished,
      sort_order: sortOrder,
    },
    errors: {},
  };
}
