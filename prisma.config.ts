import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma's CLI doesn't auto-load .env.local (only Next.js's own dev/build
// process does that) — so for standalone CLI commands (generate, migrate,
// db seed) we load it explicitly here.
config({ path: ".env.local" });

// Prisma 7 moved the CLI-facing database connection out of schema.prisma
// and into this file. This is only used by the Prisma CLI itself
// (migrate / generate / db seed) — the actual running app connects via
// the driver adapter set up in lib/prisma.ts.
//
// Migrations need Supabase's DIRECT connection, not the pooled one — the
// pooler (Transaction/Session mode) doesn't support the extra connection
// Prisma's migration engine needs, which is why `migrate dev` failed with
// "Can't reach database server" against the pooler URL. DATABASE_URL (the
// pooled connection) is what the running app uses day-to-day; DIRECT_URL
// is only for this CLI config.
//
// Using process.env directly (not the stricter `env()` helper) on purpose:
// `prisma generate` doesn't actually need a real DB connection, and should
// still succeed even before DATABASE_URL is set (e.g. before Supabase is
// connected) — the `env()` helper throws in that case, `process.env` does not.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
