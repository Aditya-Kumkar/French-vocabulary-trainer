create table if not exists public.sentence_ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null,
  request_count integer not null default 0 check (request_count >= 0 and request_count <= 20),
  created_at timestamptz not null default now(),
  primary key (user_id, usage_date)
);
alter table public.sentence_ai_usage enable row level security;
revoke all on table public.sentence_ai_usage from anon, authenticated;

create or replace function public.consume_sentence_ai_quota(p_user_id uuid, p_usage_date date, p_daily_limit integer default 20)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare allowed boolean := false;
begin
  insert into public.sentence_ai_usage(user_id, usage_date, request_count)
  values (p_user_id, p_usage_date, 1)
  on conflict (user_id, usage_date) do update
    set request_count = public.sentence_ai_usage.request_count + 1
    where public.sentence_ai_usage.request_count < p_daily_limit
  returning true into allowed;
  return coalesce(allowed, false);
end;
$$;
revoke all on function public.consume_sentence_ai_quota(uuid, date, integer) from public, anon, authenticated;
grant execute on function public.consume_sentence_ai_quota(uuid, date, integer) to service_role;
