"use client";

import { useState, type FormEvent } from "react";
import {
  Loader2,
  Send,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import {
  validateWholesaleForm,
  buildWholesaleMessage,
  type WholesaleFormValues,
  type WholesaleFormErrors,
} from "@/lib/wholesaleValidation";
import { BUSINESS_TYPES, QUANTITY_RANGES } from "@/constants/wholesale";

const INITIAL_VALUES: WholesaleFormValues = {
  contactName: "",
  businessName: "",
  businessType: "",
  city: "",
  email: "",
  phone: "",
  quantityRange: "",
  categories: [],
  notes: "",
};

const inputBaseClasses =
  "w-full rounded-xl border bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-400";

type Status = "idle" | "submitting" | "success" | "error";

interface WholesaleEnquiryFormProps {
  // Real category titles from the DB (see app/wholesale/page.tsx), so the
  // "categories interested in" list never drifts out of sync with what's
  // actually sold — same reasoning as app/categories/page.tsx.
  availableCategories: string[];
}

export default function WholesaleEnquiryForm({
  availableCategories,
}: WholesaleEnquiryFormProps) {
  const [values, setValues] = useState<WholesaleFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<WholesaleFormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  // Honeypot — same approach as ContactForm.tsx.
  const [honeypot, setHoneypot] = useState("");

  const handleChange = (
    field: keyof Omit<WholesaleFormValues, "categories">,
    value: string,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const toggleCategory = (category: string) => {
    setValues((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    const nextErrors = validateWholesaleForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.contactName,
          email: values.email,
          phone: values.phone,
          subject: "Wholesale / Dealer Enquiry",
          message: buildWholesaleMessage(values),
          company: honeypot,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 429) {
          setServerError(
            "You've sent a few enquiries already. Please try again in a little while.",
          );
        } else {
          setServerError(
            data?.error || "Something went wrong. Please try again.",
          );
        }
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setServerError(
        "Couldn't reach the server. Please check your connection and try again.",
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setServerError(null);
    setStatus("idle");
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111111] px-6 py-16 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400">
          <CheckCircle2 size={28} />
        </div>

        <h3 className="card-title mt-5 text-white">Enquiry sent</h3>

        <p className="body-text mt-2 max-w-sm">
          Thanks for reaching out. Our wholesale team usually replies within
          24 hours on business days.
        </p>

        <button
          type="button"
          onClick={handleReset}
          className="btn-secondary mt-7 inline-flex items-center gap-2"
        >
          <RefreshCw size={15} />
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-8"
    >
      {/* Honeypot field — hidden from real users, kept out of tab order. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="wholesale-company">Company</label>
        <input
          id="wholesale-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div
        aria-live="polite"
        className={
          Object.keys(errors).length > 0
            ? "mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            : "sr-only"
        }
      >
        {Object.keys(errors).length > 0 &&
          "Please fix the highlighted fields below."}
      </div>

      {status === "error" && serverError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          {serverError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Contact Name */}
        <div>
          <label
            htmlFor="contactName"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            Your Name <span className="text-yellow-400">*</span>
          </label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            autoComplete="name"
            value={values.contactName}
            onChange={(e) => handleChange("contactName", e.target.value)}
            aria-invalid={Boolean(errors.contactName)}
            aria-describedby={errors.contactName ? "contactName-error" : undefined}
            placeholder="Your full name"
            className={`${inputBaseClasses} ${
              errors.contactName ? "border-red-500/60" : "border-white/10"
            }`}
          />
          {errors.contactName && (
            <p id="contactName-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.contactName}
            </p>
          )}
        </div>

        {/* Business Name */}
        <div>
          <label
            htmlFor="businessName"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            Business / Shop Name <span className="text-yellow-400">*</span>
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            autoComplete="organization"
            value={values.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            aria-invalid={Boolean(errors.businessName)}
            aria-describedby={errors.businessName ? "businessName-error" : undefined}
            placeholder="Your business name"
            className={`${inputBaseClasses} ${
              errors.businessName ? "border-red-500/60" : "border-white/10"
            }`}
          />
          {errors.businessName && (
            <p id="businessName-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.businessName}
            </p>
          )}
        </div>

        {/* Business Type */}
        <div>
          <label
            htmlFor="businessType"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            Business Type <span className="text-yellow-400">*</span>
          </label>
          <div className="relative">
            <select
              id="businessType"
              name="businessType"
              value={values.businessType}
              onChange={(e) => handleChange("businessType", e.target.value)}
              aria-invalid={Boolean(errors.businessType)}
              aria-describedby={errors.businessType ? "businessType-error" : undefined}
              className={`${inputBaseClasses} appearance-none pr-10 ${
                errors.businessType ? "border-red-500/60" : "border-white/10"
              } ${values.businessType ? "text-white" : "text-gray-500"}`}
            >
              <option value="" disabled>
                Select business type
              </option>
              {BUSINESS_TYPES.map((option) => (
                <option key={option} value={option} className="text-white">
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
          {errors.businessType && (
            <p id="businessType-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.businessType}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            City <span className="text-yellow-400">*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            value={values.city}
            onChange={(e) => handleChange("city", e.target.value)}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? "city-error" : undefined}
            placeholder="Your city"
            className={`${inputBaseClasses} ${
              errors.city ? "border-red-500/60" : "border-white/10"
            }`}
          />
          {errors.city && (
            <p id="city-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.city}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="wholesale-email"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            Email Address <span className="text-yellow-400">*</span>
          </label>
          <input
            id="wholesale-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "wholesale-email-error" : undefined}
            placeholder="you@example.com"
            className={`${inputBaseClasses} ${
              errors.email ? "border-red-500/60" : "border-white/10"
            }`}
          />
          {errors.email && (
            <p id="wholesale-email-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="wholesale-phone"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            Phone Number <span className="text-yellow-400">*</span>
          </label>
          <input
            id="wholesale-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "wholesale-phone-error" : undefined}
            placeholder="98765 43210"
            className={`${inputBaseClasses} ${
              errors.phone ? "border-red-500/60" : "border-white/10"
            }`}
          />
          {errors.phone && (
            <p id="wholesale-phone-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Expected Quantity */}
        <div className="sm:col-span-2">
          <label
            htmlFor="quantityRange"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            Expected Order Quantity <span className="text-yellow-400">*</span>
          </label>
          <div className="relative">
            <select
              id="quantityRange"
              name="quantityRange"
              value={values.quantityRange}
              onChange={(e) => handleChange("quantityRange", e.target.value)}
              aria-invalid={Boolean(errors.quantityRange)}
              aria-describedby={errors.quantityRange ? "quantityRange-error" : undefined}
              className={`${inputBaseClasses} appearance-none pr-10 ${
                errors.quantityRange ? "border-red-500/60" : "border-white/10"
              } ${values.quantityRange ? "text-white" : "text-gray-500"}`}
            >
              <option value="" disabled>
                Select expected quantity
              </option>
              {QUANTITY_RANGES.map((option) => (
                <option key={option} value={option} className="text-white">
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
          {errors.quantityRange && (
            <p id="quantityRange-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.quantityRange}
            </p>
          )}
        </div>

        {/* Categories */}
        {availableCategories.length > 0 && (
          <div className="sm:col-span-2">
            <span className="mb-2 block text-[13px] font-medium text-gray-300">
              Categories You're Interested In{" "}
              <span className="text-gray-500">(optional)</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => {
                const isSelected = values.categories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleCategory(category)}
                    className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                      isSelected
                        ? "border-yellow-400 bg-yellow-400/10 text-yellow-300"
                        : "border-white/10 bg-transparent text-gray-400 hover:border-white/20 hover:text-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="sm:col-span-2">
          <label
            htmlFor="notes"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            Additional Details <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={values.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Anything else we should know — customization needs, timelines, etc."
            className={`${inputBaseClasses} resize-none border-white/10`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary mt-7 w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={16} />
            Submit Enquiry
          </>
        )}
      </button>
    </form>
  );
}
