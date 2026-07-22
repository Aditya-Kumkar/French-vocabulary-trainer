# French Vocabulary Trainer

A shared vocabulary practice app: everyone on your account creates their own
login, adds their own word list (English / French / Hindi pronunciation), and
practices independently.

## 1. Create a Supabase project (free)

1. Go to https://supabase.com and sign up, then **New project**.
2. Pick any name/region and a database password (save it somewhere safe — you
   won't need it day-to-day, Supabase manages the connection for you).
3. Once the project is ready, open **SQL Editor → New query**, paste in the
   entire contents of `supabase-schema.sql` from this folder, and run it.
   This creates the `profiles` and `words` tables and locks each one down so
   users can only ever see their own rows.
4. Go to **Project Settings → API**. You'll need two values from here:
   - **Project URL**
   - **anon public** key
5. Go to **Authentication → Providers → Email** and turn **off** "Confirm
   email" if you want classmates to be able to sign up and start using the
   app immediately without checking an inbox. (Leave it on if you'd rather
   they confirm via email first — either works, the app handles both.)

## 2. Run it locally (optional, to test before deploying)

```bash
npm install
cp .env.example .env
# edit .env and paste in your Project URL and anon key from step 1
npm run dev
```

Open the printed local URL, create an account, and try adding a word.

## 3. Put the code on GitHub

Netlify deploys from a Git repository.

```bash
git init
git add .
git commit -m "French vocabulary trainer"
```

Create a new repository on GitHub (github.com/new), then follow the "push an
existing repository" instructions it shows you.

## 4. Deploy on Netlify

1. Go to https://netlify.com, sign up, and click **Add new site → Import an
   existing project**.
2. Connect your GitHub account and pick this repository.
3. Build settings should auto-detect from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Before deploying, open **Site settings → Environment variables** and add:
   - `VITE_SUPABASE_URL` → your Project URL
   - `VITE_SUPABASE_ANON_KEY` → your anon public key
5. Deploy. Netlify gives you a live URL you can share with your classmates —
   each person creates their own account on it and gets their own private
   word list.

## Notes

- The anon key is safe to expose in a deployed frontend — it's designed for
  this, and the database policies (row-level security) are what actually
  keep everyone's words private, not the key.
- Any time you push a new commit to GitHub, Netlify rebuilds and redeploys
  automatically.
- If you add more fields or features later, remember to update
  `supabase-schema.sql` (and re-run the relevant `alter table` in the SQL
  Editor) alongside the app code.
