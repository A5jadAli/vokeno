-- Lesson-linked coach calls: every learner gets one free call per unit; Plus members are not
-- limited here (their daily live-practice allowance still applies). The realtime-session
-- function claims a call before it starts and releases it if the call could not start.
create table if not exists public.voka_unit_calls (
  user_id uuid not null references auth.users (id) on delete cascade,
  call_id text not null check (call_id ~ '^[a-z0-9-]{3,40}$'),
  created_at timestamptz not null default now(),
  primary key (user_id, call_id)
);

alter table public.voka_unit_calls enable row level security;
revoke all on public.voka_unit_calls from anon, authenticated;
grant all on public.voka_unit_calls to service_role;

create or replace function public.voka_unit_call(p_action text, p_user_id uuid, p_call_id text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  subscription jsonb;
begin
  if p_user_id is null or p_call_id is null or p_call_id !~ '^[a-z0-9-]{3,40}$' then
    return jsonb_build_object('allowed', false, 'reason', 'invalid');
  end if;
  if p_action = 'claim' then
    subscription := public.voka_subscription_access('read', p_user_id);
    if coalesce((subscription->>'isPlus')::boolean, false) then
      return jsonb_build_object('allowed', true, 'plus', true);
    end if;
    insert into public.voka_unit_calls (user_id, call_id) values (p_user_id, p_call_id)
      on conflict do nothing;
    if not found then
      return jsonb_build_object('allowed', false, 'reason', 'free-used');
    end if;
    return jsonb_build_object('allowed', true, 'plus', false);
  elsif p_action = 'release' then
    -- Only a claim made moments ago can be handed back: the call failed to start.
    delete from public.voka_unit_calls
      where user_id = p_user_id and call_id = p_call_id and created_at > now() - interval '5 minutes';
    return jsonb_build_object('released', true);
  end if;
  return jsonb_build_object('allowed', false, 'reason', 'invalid');
end;
$$;

revoke all on function public.voka_unit_call(text, uuid, text) from public, anon, authenticated;
grant execute on function public.voka_unit_call(text, uuid, text) to service_role;
