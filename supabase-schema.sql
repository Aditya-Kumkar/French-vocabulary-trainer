-- Run this once in your Supabase project's SQL Editor (Dashboard → SQL Editor → New query).

-- One row per user, holding the display name shown in the app.
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Each user's vocabulary list. Row Level Security means every user can only
-- ever see or change their own rows -- your classmates' word lists stay private.
create table if not exists public.words (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  english text not null,
  french text not null,
  hindi text not null,
  correct_count integer default 0,
  incorrect_count integer default 0,
  created_at timestamptz default now()
);

alter table public.words enable row level security;

create policy "Users can view own words"
  on public.words for select
  using (auth.uid() = user_id);

create policy "Users can insert own words"
  on public.words for insert
  with check (auth.uid() = user_id);

create policy "Users can update own words"
  on public.words for update
  using (auth.uid() = user_id);

create policy "Users can delete own words"
  on public.words for delete
  using (auth.uid() = user_id);

create index if not exists words_user_id_idx on public.words (user_id);


-- Shared community sentence bank. All users can read; signed-in users can contribute.
create table if not exists public.community_sentences (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  english text not null check (char_length(trim(english)) between 1 and 240),
  french text not null check (char_length(trim(french)) between 1 and 240),
  created_at timestamptz not null default now()
);

create unique index if not exists community_sentences_pair_unique
  on public.community_sentences (lower(trim(english)), lower(trim(french)));
create index if not exists community_sentences_created_at_idx
  on public.community_sentences (created_at desc);

alter table public.community_sentences enable row level security;
drop policy if exists "Anyone can read shared sentences" on public.community_sentences;
create policy "Anyone can read shared sentences" on public.community_sentences for select using (true);
drop policy if exists "Signed-in users can contribute shared sentences" on public.community_sentences;
create policy "Signed-in users can contribute shared sentences" on public.community_sentences for insert to authenticated with check (auth.uid() = created_by);
drop policy if exists "Contributors can delete own shared sentences" on public.community_sentences;
create policy "Contributors can delete own shared sentences" on public.community_sentences for delete to authenticated using (auth.uid() = created_by);
