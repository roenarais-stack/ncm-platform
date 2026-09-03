"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { submitLeadForm } from "@/app/admin/(panel)/leads/actions";
import { LEAD_SERVICE_OPTIONS } from "@/app/lib/leads/validation";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");
    setErrors({});

    try {
      const formData = new FormData(e.currentTarget);

      const result = await submitLeadForm(formData);

      if (result.success) {
        setSubmitStatus("success");
        setSubmitMessage(
          result.message ||
          "Thank you! We've received your message and will be in touch soon."
        );
        // Reset form
        setFormValues({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          message: "",
        });
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        if (result.errors) {
          setErrors(result.errors);
          setSubmitStatus("error");
          setSubmitMessage("Please fix the errors below and try again.");
        } else {
          setSubmitStatus("error");
          setSubmitMessage(
            result.message || "Something went wrong. Please try again."
          );
        }
      }
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Honeypot field - hidden from users */}
      <input
        type="hidden"
        name="website"
        value=""
        onChange={(e) => {
          if (e.target.value) {
            e.target.form?.reset();
          }
        }}
      />

      {/* Status messages */}
      {submitStatus === "success" && (
        <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700">
          <p className="font-semibold">{submitMessage}</p>
        </div>
      )}

      {submitStatus === "error" && submitMessage && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">
          <p className="font-semibold">{submitMessage}</p>
        </div>
      )}

      {/* Name field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-slate-700"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          required
          className={`mt-2 w-full rounded-lg border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 ${
            errors.name
              ? "border-red-300 focus:ring-red-500"
              : "border-slate-300 focus:ring-blue-500"
          } disabled:bg-slate-100 disabled:text-slate-500`}
          placeholder="Your name"
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-slate-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`mt-2 w-full rounded-lg border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-red-300 focus:ring-red-500"
              : "border-slate-300 focus:ring-blue-500"
          } disabled:bg-slate-100 disabled:text-slate-500`}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone field */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-slate-700"
        >
          Phone / WhatsApp
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formValues.phone}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={`mt-2 w-full rounded-lg border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 ${
            errors.phone
              ? "border-red-300 focus:ring-red-500"
              : "border-slate-300 focus:ring-blue-500"
          } disabled:bg-slate-100 disabled:text-slate-500`}
          placeholder="+92 315 6515317"
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-600">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Company field */}
      <div>
        <label
          htmlFor="company"
          className="block text-sm font-semibold text-slate-700"
        >
          Company / Business
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formValues.company}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? "company-error" : undefined}
          className={`mt-2 w-full rounded-lg border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 ${
            errors.company
              ? "border-red-300 focus:ring-red-500"
              : "border-slate-300 focus:ring-blue-500"
          } disabled:bg-slate-100 disabled:text-slate-500`}
          placeholder="Your company name"
        />
        {errors.company && (
          <p id="company-error" className="mt-1 text-sm text-red-600">
            {errors.company}
          </p>
        )}
      </div>

      {/* Service field */}
      <div>
        <label
          htmlFor="service"
          className="block text-sm font-semibold text-slate-700"
        >
          Service Interested In
        </label>
        <select
          id="service"
          name="service"
          value={formValues.service}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={!!errors.service}
          aria-describedby={errors.service ? "service-error" : undefined}
          className={`mt-2 w-full rounded-lg border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 ${
            errors.service
              ? "border-red-300 focus:ring-red-500"
              : "border-slate-300 focus:ring-blue-500"
          } disabled:bg-slate-100 disabled:text-slate-500`}
        >
          <option value="">Select a service</option>
          {LEAD_SERVICE_OPTIONS.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        {errors.service && (
          <p id="service-error" className="mt-1 text-sm text-red-600">
            {errors.service}
          </p>
        )}
      </div>

      {/* Message field */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-slate-700"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formValues.message}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          rows={5}
          className={`mt-2 w-full rounded-lg border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 ${
            errors.message
              ? "border-red-300 focus:ring-red-500"
              : "border-slate-300 focus:ring-blue-500"
          } disabled:bg-slate-100 disabled:text-slate-500`}
          placeholder="Tell us about your project..."
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed sm:w-auto"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
