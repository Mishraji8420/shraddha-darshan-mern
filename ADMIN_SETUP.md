# Admin Dashboard — Phase 2.5

A real admin panel at `/admin` — manage products and categories without
touching Prisma Studio or the database directly.

## What was added

- `role` field on `User` ("CUSTOMER" | "ADMIN") — schema + auth session
  changes so `/admin` is only reachable by admins (checked at the edge in
  `proxy.ts` AND again server-side in `app/admin/layout.tsx` — same
  defense-in-depth pattern as `/account`, see the CVE-2025-29927 note in
  `proxy.ts`).
- `app/admin/*` — Dashboard overview (stat cards, low-stock alerts),
  Products (searchable/paginated table, add/edit/delete), Categories
  (list + inline add/edit/delete). "Orders" is in the sidebar as a
  disabled "Soon" item — no order data exists until Phase 3.
- `app/api/admin/*` — the actual CRUD endpoints the dashboard calls
  (products, categories, image upload), all guarded by
  `lib/admin-auth.ts`'s `requireAdminApi()`.
- **Every create/update/delete calls `revalidateTag()`** so the storefront
  cache (`lib/cached-queries.ts`, added in the speed-optimization pass)
  doesn't show stale data after an admin edit.
- **Image uploads** go to **Supabase Storage** — reuses the same Supabase
  project you already have for the database, no new account needed.

## Setup — do these in order

### 1. Migrate the database
```bash
npm install
npx prisma migrate dev --name add_admin_role
```

### 2. Make yourself an admin
There's deliberately no self-serve way to become an admin (security). Sign
up normally at `/signup` first, then:
- Open Prisma Studio: `npx prisma studio`
- Open the **User** table, find your row
- Change `role` from `CUSTOMER` to `ADMIN`, save
- Log out and back in (so your session picks up the new role)
- `/admin` should now load instead of redirecting you to `/`

### 3. Set up image storage (Supabase Storage)
- In your Supabase dashboard: **Storage** (left sidebar) → **New bucket**
- Name it exactly: `product-images`
- Toggle **Public bucket** ON (product photos need to be publicly viewable
  on the storefront)
- Create it

Then get two values from **Project Settings → API** in the same Supabase
dashboard, and add them to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL='https://xxxxxxxxxxxx.supabase.co'
SUPABASE_SERVICE_ROLE_KEY='eyJ...'
```
(The "service role" key is different from your database password — it's
under API settings, labeled "service_role", marked secret. Never expose
this key to the browser or commit it.)

### 4. Test it
```bash
npm run dev
```
Go to `/admin` → Products → Add Product → upload an image, fill the form,
save. Then check `/collections` on the storefront — the new product
should appear (cache is invalidated automatically on save).

## Design notes / deliberate scope boundaries

- **Slug is not editable after creation** for categories (it's baked into
  every `/collections?category=<slug>` link). Products' slugs ARE
  editable — just re-checked for uniqueness on save.
- **Deleting a category is blocked** if products still reference it (the
  API returns a clear error instead of silently orphaning products).
- **Rating/review count aren't in the admin form** — those reflect real
  customer reviews once Phase 5 (Reviews) exists; editing fake numbers by
  hand isn't something this dashboard encourages.
- **No bulk actions** (bulk delete/export) in this pass — one product/
  category at a time. Add later if the catalog grows large enough to need it.

## Next phase

Phase 3 — Cart/Checkout, so "Orders" in the admin sidebar has real data
to show.
