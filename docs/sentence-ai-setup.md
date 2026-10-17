# Secure sentence AI setup

The Sentence Practice Lab uses the verified sentence bank first. New sentences call the Supabase Edge Function `translate-sentence`, which uses Groq server-side. The browser must never receive `GROQ_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY`.

## Required Supabase secrets

Set these in the Supabase project that backs the app:

- `GROQ_API_KEY`: API key created by the project owner in Groq.
- `GROQ_MODEL`: optional model override; defaults to `llama-3.3-70b-versatile`.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only service role key used for atomic quota consumption.
- `APP_ORIGIN`: optional exact app origin, for example `https://french-vocabulary-trainer-eight.vercel.app`. If a different preview origin is needed, set the exact expected origin for that environment.

Supabase supplies `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Edge Functions. Do not add any server secret to `VITE_*` variables or commit secrets to GitHub.

## Database and deploy

1. Apply `supabase/migrations/202610170001_sentence_ai_usage.sql` to the linked Supabase project.
2. Set the secrets above in Supabase.
3. Deploy `supabase/functions/translate-sentence`.
4. Test while signed in: verified sentence lookup should work without calling AI; a new sentence should use Groq.
5. Verify unauthenticated requests fail, malformed/long input is rejected, and a user is blocked after 20 AI translation requests in one UTC day.

The quota is per authenticated Supabase user and is enforced atomically in Postgres. It is a usage cap, not a separate Groq API key or a guarantee that AI output is correct. AI-generated French is labelled as AI-assisted, not independently verified.
