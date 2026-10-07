-- Spanish brings guided lessons to three languages. Worst-case progress for every lesson now
-- exceeds the original 64 KB cap, so allow 256 KB. Clients still bound each lesson's history.
alter table public.user_learning_state
  drop constraint if exists foundations_bounded_object;
alter table public.user_learning_state
  add constraint foundations_bounded_object check (
    jsonb_typeof(foundations) = 'object' and octet_length(foundations::text) <= 262144
  );
