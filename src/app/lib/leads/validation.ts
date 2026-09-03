export const LEAD_SERVICE_OPTIONS = [
  "Brand Identity",
  "Web Development",
  "Digital Marketing",
  "Video Editing",
  "AI Automation",
  "Business Growth",
] as const;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface LeadFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

export interface LeadFormData {
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  service: (typeof LEAD_SERVICE_OPTIONS)[number] | null;
  message: string | null;
}

export interface LeadValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
}

const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  company: 160,
  service: 80,
  message: 4000,
} as const;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function asOptional(value: string) {
  return value || null;
}

export function getHoneypotValue(formData: FormData) {
  return getString(formData, "website");
}

export function validateLeadForm(formData: FormData): {
  data: LeadFormData | null;
  errors: LeadValidationErrors;
  values: LeadFormValues;
} {
  const values: LeadFormValues = {
    name: getString(formData, "name"),
    email: getString(formData, "email").toLowerCase(),
    phone: getString(formData, "phone"),
    company: getString(formData, "company"),
    service: getString(formData, "service"),
    message: getString(formData, "message"),
  };
  const errors: LeadValidationErrors = {};

  if (!values.name) errors.name = "Name is required.";
  else if (values.name.length > LIMITS.name) {
    errors.name = `Name must be ${LIMITS.name} characters or fewer.`;
  }

  if (values.email.length > LIMITS.email) {
    errors.email = `Email must be ${LIMITS.email} characters or fewer.`;
  } else if (
    values.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  const phoneDigits = values.phone.replace(/\D/g, "");
  if (values.phone.length > LIMITS.phone) {
    errors.phone = `Phone must be ${LIMITS.phone} characters or fewer.`;
  } else if (
    values.phone &&
    (!/^[0-9+().\-\s]+$/.test(values.phone) || phoneDigits.length < 7)
  ) {
    errors.phone = "Enter a valid phone number.";
  }

  if (values.company.length > LIMITS.company) {
    errors.company = `Company must be ${LIMITS.company} characters or fewer.`;
  }

  if (values.service.length > LIMITS.service) {
    errors.service = "Choose a valid service.";
  } else if (
    values.service &&
    !LEAD_SERVICE_OPTIONS.includes(
      values.service as (typeof LEAD_SERVICE_OPTIONS)[number],
    )
  ) {
    errors.service = "Choose a valid service.";
  }

  if (values.message.length > LIMITS.message) {
    errors.message = `Message must be ${LIMITS.message} characters or fewer.`;
  }

  if (Object.keys(errors).length > 0) {
    return { data: null, errors, values };
  }

  return {
    data: {
      name: values.name,
      email: asOptional(values.email),
      phone: asOptional(values.phone),
      company: asOptional(values.company),
      service: asOptional(values.service) as LeadFormData["service"],
      message: asOptional(values.message),
    },
    errors: {},
    values,
  };
}

export function isLeadStatus(value: string): value is LeadStatus {
  return LEAD_STATUSES.includes(value as LeadStatus);
}
