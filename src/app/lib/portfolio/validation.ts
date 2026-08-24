export const PORTFOLIO_LIMITS = {
  title: 120,
  slug: 160,
  category: 80,
  description: 2000,
  imagePath: 500,
  externalUrl: 2048,
} as const;

export interface PortfolioInput {
  title: string;
  slug: string;
  category: string;
  description: string;
  image_path: string | null;
  external_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface ValidationResult {
  data?: PortfolioInput;
  errors: Record<string, string>;
}

function trimOptional(value: FormDataEntryValue | null) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function validatePortfolioForm(formData: FormData): ValidationResult {
  const title = String(formData.get("title") ?? "").trim();
  const slug = normalizeSlug(String(formData.get("slug") ?? ""));
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image_path = trimOptional(formData.get("image_path"));
  const external_url = trimOptional(formData.get("external_url"));
  const sort_order = Number.parseInt(
    String(formData.get("sort_order") ?? "0"),
    10,
  );
  const is_published = formData.get("is_published") === "on";
  const errors: Record<string, string> = {};

  if (!title) errors.title = "Title is required.";
  else if (title.length > PORTFOLIO_LIMITS.title) {
    errors.title = `Title must be ${PORTFOLIO_LIMITS.title} characters or fewer.`;
  }

  if (!slug) errors.slug = "A valid slug is required.";
  else if (slug.length > PORTFOLIO_LIMITS.slug) {
    errors.slug = `Slug must be ${PORTFOLIO_LIMITS.slug} characters or fewer.`;
  }

  if (!category) errors.category = "Category is required.";
  else if (category.length > PORTFOLIO_LIMITS.category) {
    errors.category = `Category must be ${PORTFOLIO_LIMITS.category} characters or fewer.`;
  }

  if (!description) errors.description = "Description is required.";
  else if (description.length > PORTFOLIO_LIMITS.description) {
    errors.description = `Description must be ${PORTFOLIO_LIMITS.description} characters or fewer.`;
  }

  if (image_path && (image_path.length > PORTFOLIO_LIMITS.imagePath || image_path.startsWith("/") || image_path.includes("://") || image_path.includes("\\"))) {
    errors.image_path = "Image path must be a relative storage object path.";
  }

  if (external_url) {
    try {
      const url = new URL(external_url);
      if (
        url.protocol !== "https:" ||
        external_url.length > PORTFOLIO_LIMITS.externalUrl ||
        external_url.startsWith("//")
      ) {
        errors.external_url = "External URL must be a valid HTTPS URL.";
      }
    } catch {
      errors.external_url = "External URL must be a valid HTTPS URL.";
    }
  }

  if (!Number.isInteger(sort_order) || sort_order < 0) {
    errors.sort_order = "Sort order must be a non-negative integer.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    errors,
    data: {
      title,
      slug,
      category,
      description,
      image_path,
      external_url,
      is_published,
      sort_order,
    },
  };
}
