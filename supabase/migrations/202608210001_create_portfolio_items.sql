create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  description text not null,
  image_path text,
  external_url text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_items_title_length check (char_length(title) between 1 and 120),
  constraint portfolio_items_slug_format check (
    char_length(slug) between 1 and 160
    and slug = lower(slug)
    and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint portfolio_items_category_length check (char_length(category) between 1 and 80),
  constraint portfolio_items_description_length check (char_length(description) between 1 and 2000),
  constraint portfolio_items_image_path check (
    image_path is null
    or (
      char_length(image_path) between 1 and 500
      and image_path = btrim(image_path)
      and image_path not like '/%'
      and image_path not like '%://%'
      and image_path not like '%\\%'
    )
  ),
  constraint portfolio_items_external_url check (
    external_url is null
    or (
      char_length(external_url) between 1 and 2048
      and external_url = btrim(external_url)
      and lower(external_url) ~ '^https://[^/?#[:space:]]+([/?#].*)?$'
      and external_url not like '% %'
    )
  ),
  constraint portfolio_items_sort_order check (sort_order >= 0)
);

create index portfolio_items_public_order_idx
  on public.portfolio_items (sort_order asc, created_at desc)
  where is_published = true;

create index portfolio_items_admin_order_idx
  on public.portfolio_items (sort_order asc, created_at desc);

alter table public.portfolio_items enable row level security;

grant select on public.portfolio_items to anon, authenticated;
grant insert, update, delete on public.portfolio_items to authenticated;

create policy "Published portfolio items are publicly readable"
  on public.portfolio_items
  for select
  to anon, authenticated
  using (is_published = true);

create policy "Admins can manage portfolio items"
  on public.portfolio_items
  for all
  to authenticated
  using (is_admin())
  with check (is_admin());

create trigger portfolio_items_updated_at
  before update on public.portfolio_items
  for each row
  execute function public.set_updated_at();
