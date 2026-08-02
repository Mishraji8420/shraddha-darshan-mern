import { createClient } from "@supabase/supabase-js";

// Server-only — uses the service role key, which bypasses Row Level
// Security entirely. Never import this file from a "use client" component
// or expose SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.
//
// Reuses the same Supabase project already set up for the database
// (Settings → API in the Supabase dashboard for the URL + service role
// key) — no new external account needed, just enabling Storage on the
// existing project.
export const PRODUCT_IMAGES_BUCKET = "product-images";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — see ADMIN_SETUP.md.",
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export { getSupabaseAdmin };
