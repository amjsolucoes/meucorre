create table public.landing_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.landing_waitlist enable row level security;

create policy "Qualquer pessoa pode se inscrever"
  on public.landing_waitlist for insert
  to anon
  with check (true);
