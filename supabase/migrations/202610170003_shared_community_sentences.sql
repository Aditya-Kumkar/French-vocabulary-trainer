-- Shared community sentence bank.
-- Any signed-in user may contribute; every app user can read contributions.
create table if not exists public.community_sentences (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid() references auth.users(id) on delete set null,
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
create policy "Anyone can read shared sentences"
  on public.community_sentences for select
  using (true);

drop policy if exists "Signed-in users can contribute shared sentences" on public.community_sentences;
create policy "Signed-in users can contribute shared sentences"
  on public.community_sentences for insert
  to authenticated
  with check (auth.uid() = created_by);

-- Contributions are shared immediately. Only the contributor can remove their own row.
drop policy if exists "Contributors can delete own shared sentences" on public.community_sentences;
create policy "Contributors can delete own shared sentences"
  on public.community_sentences for delete
  to authenticated
  using (auth.uid() = created_by);
