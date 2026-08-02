"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

type Status = "verifying" | "success" | "error";

export default function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>(token ? "verifying" : "error");
  const [message, setMessage] = useState(
    token ? "" : "This verification link is missing its token.",
  );

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok) {
          setStatus("error");
          setMessage(data?.error || "Verification failed.");
          return;
        }
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
          setMessage("Network error. Please try again.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <Loader2 size={32} className="mb-3 animate-spin text-yellow-400" />
        <p className="text-gray-300">Verifying your email...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <AlertTriangle size={36} className="mb-3 text-red-400" />
        <p className="text-white">Verification failed</p>
        <p className="mt-1.5 text-sm text-gray-400">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-4 text-center">
      <CheckCircle2 size={40} className="mb-3 text-green-400" />
      <p className="text-white">Email verified!</p>
      <p className="mt-1.5 text-sm text-gray-400">
        Your account is now active — you&apos;re good to go.
      </p>
      <Link
        href="/login"
        className="mt-5 rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300"
      >
        Go to Login
      </Link>
    </div>
  );
}
