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

  -- Ensure user_metadata exists
  if jsonb_typeof(claims->'user_metadata') is null then
    claims := jsonb_set(claims, '{user_metadata}', '{}');
  end if;

  -- Set or update plan inside user_metadata
  if user_plan is not null then
    claims := jsonb_set(claims, '{user_metadata, plan}', to_jsonb(user_plan));
  else
    claims := jsonb_set(claims, '{user_metadata, plan}', to_jsonb('FREE'));
  end if;

  -- Update the claims in the original event
  event := jsonb_set(event, '{claims}', claims);

  return event;
end;
$$;
