# Sentence Lab AI translation setup

Sentence Lab works immediately with the curated bilingual sentence bank. New English sentences use the Supabase Edge Function `translate-sentence`; the OpenAI key is read only by the server-side function and must never be added to Vite environment variables or committed to the repository.

## Configure once

1. Deploy the function to the same Supabase project used by the app:

   ```sh
   supabase functions deploy translate-sentence
   ```

2. Add your provider key as a Supabase secret (run locally in your terminal; do not paste the value into GitHub):

   ```sh
   supabase secrets set OPENAI_API_KEY=your_key_here
   ```

3. Optional settings:

   ```sh
   supabase secrets set OPENAI_MODEL=gpt-4o-mini
   supabase secrets set APP_ORIGIN=https://your-app-domain.example
   ```

   Set `APP_ORIGIN` to the exact deployed app origin for production. When omitted, the function permits cross-origin requests; authentication is still required, but setting the exact origin is recommended.

4. The function uses Supabase JWT verification and checks the authenticated user. It limits input to 240 characters, times out after 15 seconds, validates the structured response, and returns beginner-level French plus a short English explanation.

## Behaviour and safety

- Exact matches in `src/sentenceBank.js` use the verified translation and never call AI.
- AI translations are marked as AI-assisted in the UI and should be checked with a teacher.
- If the Edge Function or provider key is not configured, learners can still practise every verified sentence.
- Never expose `OPENAI_API_KEY` in `VITE_*` variables, frontend code, logs, or commits.
