-- Anonymous usage counts, to judge design changes on retention and finished calls.
-- Keyed by a random install ID made on the phone, never by account: no content, audio, text,
-- answers or device details. One row per install, local day, event and language.
create table if not exists public.voka_usage_days (
  install_id uuid not null,
  day date not null,
  kind text not null check (kind in ('active_day', 'call_started', 'call_completed')),
  track text not null check (track in ('EN', 'DE', 'ES')),
  count integer not null default 1 check (count between 1 and 100),
  primary key (install_id, day, kind, track)
);
alter table public.voka_usage_days enable row level security;
revoke all on public.voka_usage_days from public, anon, authenticated;

-- The only way in. The day is the learner's local day, so it may be a day either side of the
-- server's. Counts stop at 100 a day, and rows older than 13 months are removed as the install
-- writes, so a broken or hostile client cannot grow one install without limit.
create or replace function public.voka_record_usage(p_install_id uuid, p_day date, p_kind text, p_track text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_install_id is null or p_day is null
    or p_day not between current_date - 1 and current_date + 1
    or p_kind not in ('active_day', 'call_started', 'call_completed')
    or p_track not in ('EN', 'DE', 'ES') then
    return;
  end if;
  insert into public.voka_usage_days (install_id, day, kind, track)
    values (p_install_id, p_day, p_kind, p_track)
    on conflict (install_id, day, kind, track)
    do update set count = least(public.voka_usage_days.count + 1, 100);
  delete from public.voka_usage_days
    where install_id = p_install_id and day < current_date - interval '13 months';
end;
$$;
revoke all on function public.voka_record_usage(uuid, date, text, text) from public;
grant execute on function public.voka_record_usage(uuid, date, text, text) to anon, authenticated;

-- For the team (service role only): day-N retention by the week installs first practised, and
-- how many started calls were finished.
create or replace view public.voka_usage_retention with (security_invoker = true) as
with first_day as (
  select install_id, min(day) as first_day
  from public.voka_usage_days where kind = 'active_day' group by install_id
)
select
  date_trunc('week', f.first_day)::date as cohort_week,
  count(*) as installs,
  count(*) filter (where exists (
    select 1 from public.voka_usage_days d where d.install_id = f.install_id
      and d.kind = 'active_day' and d.day = f.first_day + 1)) as day_1,
  count(*) filter (where exists (
    select 1 from public.voka_usage_days d where d.install_id = f.install_id
      and d.kind = 'active_day' and d.day = f.first_day + 7)) as day_7
from first_day f group by 1 order by 1;
revoke all on public.voka_usage_retention from public, anon, authenticated;

create or replace view public.voka_usage_calls with (security_invoker = true) as
select date_trunc('week', day)::date as week, track,
  sum(count) filter (where kind = 'call_started') as started,
  sum(count) filter (where kind = 'call_completed') as completed
from public.voka_usage_days where kind in ('call_started', 'call_completed')
group by 1, 2 order by 1, 2;
revoke all on public.voka_usage_calls from public, anon, authenticated;
