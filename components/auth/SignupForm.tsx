"use client";

import { useState, type FormEvent } from "react";
import { Loader2, AlertTriangle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import {
  validateSignupForm,
  type SignupFormValues,
  type FieldErrors,
} from "@/lib/authValidation";

const inputBaseClasses =
  "w-full rounded-xl border bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-400";

type Status = "idle" | "submitting" | "success" | "error";

export default function SignupForm() {
  const [values, setValues] = useState<SignupFormValues>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (field: keyof SignupFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    const nextErrors = validateSignupForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 400 && data?.fieldErrors) {
          setErrors(data.fieldErrors);
          setStatus("idle");
          return;
        }
        setServerError(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <CheckCircle2 size={40} className="mb-3 text-green-400" />
        <p className="text-white">Account created!</p>
        <p className="mt-1.5 text-sm text-gray-400">
          We&apos;ve sent a verification link to <strong>{values.email}</strong>.
          Please check your inbox to activate your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
          <AlertTriangle size={15} className="shrink-0" />
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-gray-300">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Your name"
          className={`${inputBaseClasses} ${errors.name ? "border-red-500/50" : "border-white/10"}`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="you@example.com"
          className={`${inputBaseClasses} ${errors.email ? "border-red-500/50" : "border-white/10"}`}
        />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm text-gray-300">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="At least 8 characters"
            className={`${inputBaseClasses} pr-11 ${errors.password ? "border-red-500/50" : "border-white/10"}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
        {status === "submitting" ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
