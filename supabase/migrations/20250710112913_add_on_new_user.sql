-- Create function to auto-insert a row into public.User with FREE plan
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public."User" (id, plan)
  values (new.id, 'FREE');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger on auth.users to call handle_new_user after insert
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function handle_new_user();
