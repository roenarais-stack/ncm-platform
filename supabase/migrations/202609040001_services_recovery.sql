create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_services_published
  on public.services (is_published, sort_order);

alter table public.services enable row level security;

create policy "Admins can manage services"
  on public.services
  for all
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "Public can view published services"
  on public.services
  for select
  to anon, authenticated
  using (is_published = true);

create trigger services_updated_at
  before update on public.services
  for each row
  execute function public.set_updated_at();
