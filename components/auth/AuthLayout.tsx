import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Image
            src="/img/logo/logo.png"
            alt="Shraddha Darshan"
            width={56}
            height={56}
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-8">
          <p className="badge-text text-yellow-400">Shraddha Darshan</p>
          <h1 className="mt-2 text-2xl font-bold text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-gray-400">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-gray-500">{footer}</p>
        )}
      </div>
    </main>
  );
}
