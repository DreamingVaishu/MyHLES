# Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. In Supabase Auth providers, enable Google.
5. Add this redirect URL in Supabase Auth URL settings:
   - `http://localhost:3000/parent`
6. Add the same redirect URL in your Google OAuth client.

The schema includes permissive development RLS policies so the browser app can work during setup. Replace them with stricter role-based policies before production.
