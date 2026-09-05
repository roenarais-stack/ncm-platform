alter table public.portfolio_items
  add column featured_slot smallint,
  add column overview text,
  add column challenge text,
  add column solution text,
  add column outcome text,
  add constraint portfolio_items_featured_slot_check
    check (featured_slot is null or featured_slot between 1 and 3),
  add constraint portfolio_items_featured_slot_published_check
    check (featured_slot is null or is_published = true),
  add constraint portfolio_items_overview_not_blank_check
    check (overview is null or btrim(overview) <> ''),
  add constraint portfolio_items_challenge_not_blank_check
    check (challenge is null or btrim(challenge) <> ''),
  add constraint portfolio_items_solution_not_blank_check
    check (solution is null or btrim(solution) <> ''),
  add constraint portfolio_items_outcome_not_blank_check
    check (outcome is null or btrim(outcome) <> '');

create unique index portfolio_items_featured_slot_unique_idx
  on public.portfolio_items (featured_slot)
  where featured_slot is not null;

create index portfolio_items_public_featured_order_idx
  on public.portfolio_items (featured_slot asc, created_at desc)
  where is_published = true
    and featured_slot is not null;

create table public.portfolio_item_services (
  portfolio_item_id uuid not null
    references public.portfolio_items(id) on delete cascade,
  service_id uuid not null
    references public.services(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (portfolio_item_id, service_id)
);

create index portfolio_item_services_service_id_idx
  on public.portfolio_item_services (service_id);

alter table public.portfolio_item_services enable row level security;

grant select on public.portfolio_item_services to anon, authenticated;
grant insert, update, delete on public.portfolio_item_services to authenticated;

create policy "Published portfolio item service links are publicly readable"
  on public.portfolio_item_services
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.portfolio_items
      where portfolio_items.id = portfolio_item_services.portfolio_item_id
        and portfolio_items.is_published = true
    )
  );

create policy "Admins can manage portfolio item service links"
  on public.portfolio_item_services
  for all
  to authenticated
  using (is_admin())
  with check (is_admin());
