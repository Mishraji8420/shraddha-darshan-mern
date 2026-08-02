import Link from "next/link";
import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account | Shraddha Darshan",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join Shraddha Darshan for a faster checkout and order tracking"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-yellow-400 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
