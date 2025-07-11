create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_plan public."UserPlan";
begin
  -- Fetch the plan from your User table
  select plan into user_plan from public."User" where id = (event->>'user_id')::uuid;

  claims := event->'claims';

  if user_plan is not null then
    claims := jsonb_set(claims, '{plan}', to_jsonb(user_plan));
  else
    claims := jsonb_set(claims, '{plan}', to_jsonb('FREE'));
  end if;

  event := jsonb_set(event, '{claims}', claims);

  return event;
end;
$$;

grant usage on schema public to supabase_auth_admin;

grant execute on function public.custom_access_token_hook to supabase_auth_admin;

revoke execute on function public.custom_access_token_hook from authenticated, anon, public;

-- Grant needed permissions on public.User
grant all on table public."User" to supabase_auth_admin;
revoke all on table public."User" from authenticated, anon, public;

-- Policy to allow supabase_auth_admin read access if needed
create policy "Allow auth admin to read user" on public."User"
as permissive for select
to supabase_auth_admin
using (true);
