-- Days the learner practised and what they did ('2026-10-07:lr'), for the streak and daily plan.
-- Existing per-user RLS policies on user_learning_state cover the new column.
alter table public.user_learning_state
  add column if not exists practice_log text[] not null default '{}'::text[];
alter table public.user_learning_state
  add constraint practice_log_bounded check (
    cardinality(practice_log) <= 400
    and octet_length(array_to_string(practice_log, ',')) <= 8000
  );
