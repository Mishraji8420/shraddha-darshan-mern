"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { validateEmail } from "@/lib/authValidation";

const inputBaseClasses =
  "w-full rounded-xl border bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-400";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } finally {
      // Always show the same success state, whether or not the account
      // exists — the API deliberately never reveals that either.
      setSubmitting(false);
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <CheckCircle2 size={40} className="mb-3 text-green-400" />
        <p className="text-white">Check your email</p>
        <p className="mt-1.5 text-sm text-gray-400">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a
          link to reset your password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          placeholder="you@example.com"
          className={`${inputBaseClasses} ${error ? "border-red-500/50" : "border-white/10"}`}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && <Loader2 size={16} className="animate-spin" />}
        {submitting ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
}
