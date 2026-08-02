

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
  validateContactForm,
  CONTACT_SUBJECT_OPTIONS,
  type ContactFormValues,
  type ContactFormErrors,
} from "@/lib/contactValidation";
 
const INITIAL_VALUES: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};
 
const inputBaseClasses =
  "w-full rounded-xl border bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-400";
 
type Status = "idle" | "submitting" | "success" | "error";
 
export default function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  // Honeypot: a field real visitors never see or fill in. Bots that
  // auto-fill every input on the page will fill this, and we quietly
  // reject the submission on the server without giving them feedback.
  const [honeypot, setHoneypot] = useState("");
 
  const handleChange = (field: keyof ContactFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };
 
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
 
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
 
    setStatus("submitting");
 
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot }),
      });
 
      const data = await response.json().catch(() => null);
 
      if (!response.ok) {
        // Server re-validated and found problems — surface them on the
        // right fields, same as client-side validation would.
        if (response.status === 400 && data?.fieldErrors) {
          setErrors(data.fieldErrors);
          setStatus("idle");
          return;
        }
 
        if (response.status === 429) {
          setServerError(
            "You've sent a few messages already. Please try again in a little while.",
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
      // Network failure — user is offline, or the request couldn't reach
      // the server at all.
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
 
        <h3 className="card-title mt-5 text-white">Message sent</h3>
 
        <p className="body-text mt-2 max-w-sm">
          Thanks for reaching out. Our team usually replies within 24 hours
          on business days.
        </p>
 
        <button
          type="button"
          onClick={handleReset}
          className="btn-secondary mt-7 inline-flex items-center gap-2"
        >
          <RefreshCw size={15} />
          Send another message
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
      {/* Honeypot field — hidden from real users via CSS, not display:none
          (which some bots skip over), and kept out of the tab order. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
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
        {/* Name */}
        <div className="sm:col-span-1">
          <label
            htmlFor="name"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            Full Name <span className="text-yellow-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="Your full name"
            className={`${inputBaseClasses} ${
              errors.name ? "border-red-500/60" : "border-white/10"
            }`}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.name}
            </p>
          )}
        </div>
 
        {/* Email */}
        <div className="sm:col-span-1">
          <label
            htmlFor="email"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            Email Address <span className="text-yellow-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="you@example.com"
            className={`${inputBaseClasses} ${
              errors.email ? "border-red-500/60" : "border-white/10"
            }`}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.email}
            </p>
          )}
        </div>
 
        {/* Phone */}
        <div className="sm:col-span-1">
          <label
            htmlFor="phone"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            Phone Number <span className="text-gray-500">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            placeholder="98765 43210"
            className={`${inputBaseClasses} ${
              errors.phone ? "border-red-500/60" : "border-white/10"
            }`}
          />
          {errors.phone && (
            <p id="phone-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.phone}
            </p>
          )}
        </div>
 
        {/* Subject */}
        <div className="sm:col-span-1">
          <label
            htmlFor="subject"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            Subject <span className="text-yellow-400">*</span>
          </label>
          <div className="relative">
            <select
              id="subject"
              name="subject"
              value={values.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? "subject-error" : undefined}
              className={`${inputBaseClasses} appearance-none pr-10 ${
                errors.subject ? "border-red-500/60" : "border-white/10"
              } ${values.subject ? "text-white" : "text-gray-500"}`}
            >
              <option value="" disabled>
                Select a subject
              </option>
              {CONTACT_SUBJECT_OPTIONS.map((option) => (
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
          {errors.subject && (
            <p id="subject-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.subject}
            </p>
          )}
        </div>
 
        {/* Message */}
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="mb-2 block text-[13px] font-medium text-gray-300"
          >
            Message <span className="text-yellow-400">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={(e) => handleChange("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            placeholder="Tell us how we can help..."
            className={`${inputBaseClasses} resize-none ${
              errors.message ? "border-red-500/60" : "border-white/10"
            }`}
          />
          {errors.message && (
            <p id="message-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.message}
            </p>
          )}
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
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
 