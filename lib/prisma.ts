import { config } from "dotenv";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Next.js already loads .env.local automatically for anything running
// through `next dev` / `next build` — this is only here so lib/prisma.ts
// also works correctly if a standalone script (outside Next) imports it.
config({ path: ".env.local" });

// Prisma 7 requires a driver adapter for every database — there's no more
// implicit "just pass a url and it connects" behavior. PrismaPg wraps the
// standard `pg` driver.
//
// `ssl: { rejectUnauthorized: false }` is required for Supabase: Node's
// default strict certificate validation rejects Supabase's cert chain,
// which is what was causing "can't reach database server" even though the
// database was reachable the whole time (confirmed with a raw `pg` test).
function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  return new PrismaClient({ adapter });
}

// Next.js dev mode hot-reloads modules on every save, which would normally
// create a brand-new PrismaClient (and a brand-new DB connection pool) each
// time. Stashing the client on `globalThis` in development re-uses the same
// instance across reloads. In production each serverless invocation gets a
// fresh module scope anyway, so this is a no-op there.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
