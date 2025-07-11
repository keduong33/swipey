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