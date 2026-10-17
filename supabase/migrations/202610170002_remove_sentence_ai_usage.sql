-- Remove the retired AI translation quota infrastructure.
-- Keep the historical migration above for existing environments.
drop function if exists public.consume_sentence_ai_quota(uuid, date, integer);
drop table if exists public.sentence_ai_usage;
