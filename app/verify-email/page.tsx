import { Suspense } from "react";
import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import VerifyEmailStatus from "@/components/auth/VerifyEmailStatus";

export const metadata: Metadata = {
  title: "Verify Email | Shraddha Darshan",
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout title="Email Verification" subtitle="">
      <Suspense fallback={null}>
        <VerifyEmailStatus />
      </Suspense>
    </AuthLayout>
  );
}
