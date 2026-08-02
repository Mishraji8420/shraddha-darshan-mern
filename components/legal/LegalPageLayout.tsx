import type { ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

/**
 * Shared shell for Privacy Policy / Terms & Conditions / Shipping Policy /
 * Return & Refund Policy. No @tailwindcss/typography plugin is installed
 * in this project (checked package.json), so headings/paragraphs use the
 * LegalH2 / LegalP helpers below instead of a `prose` class that wouldn't
 * do anything — and instead of new global CSS (which would mean editing
 * globals.css, a shared file more likely to collide with your recent
 * Auth/Dashboard changes).
 */
export default function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 px-6 py-14 text-center sm:px-10 sm:py-16">
        <h1 className="section-title text-white">{title}</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: {lastUpdated}</p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-16">
        <div className="space-y-8">{children}</div>
      </section>
    </main>
  );
}

export function LegalH2({ children }: { children: ReactNode }) {
  return <h2 className="card-title text-white">{children}</h2>;
}

export function LegalP({ children }: { children: ReactNode }) {
  return <p className="body-text mt-3">{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="body-text mt-3 list-disc space-y-2 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
