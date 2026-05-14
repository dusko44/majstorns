-- MajstorNS initial schema
-- PostGIS for geo queries (nearest craftsmen)
create extension if not exists postgis;

-- categories: limar, stolar, vodoinstalater...
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_sr text not null,
  plural_sr text not null,
  icon_url text,
  hero_image_url text,
  seo_meta_description text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- neighborhoods: centar, liman, petrovaradin...
create table public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_sr text not null,
  city text not null,
  center_point geography(point, 4326) not null,
  created_at timestamptz default now()
);

create index neighborhoods_center_idx on public.neighborhoods using gist(center_point);

-- craftsmen: the directory entries
create table public.craftsmen (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  business_name text not null,
  category_id uuid not null references public.categories(id),
  neighborhood_id uuid references public.neighborhoods(id),
  description text,
  address text not null,
  location geography(point, 4326) not null,
  phone text,
  website text,
  viber text,
  whatsapp text,
  email text,
  working_hours jsonb,
  image_urls text[] not null default '{}',
  source text not null default 'scraped' check (source in ('scraped', 'manual', 'claimed')),
  status text not null default 'pending' check (status in ('pending', 'contacted', 'paid', 'removed')),
  paid_until date,
  google_place_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index craftsmen_location_idx on public.craftsmen using gist(location);
create index craftsmen_category_idx on public.craftsmen(category_id);
create index craftsmen_neighborhood_idx on public.craftsmen(neighborhood_id);
create index craftsmen_status_idx on public.craftsmen(status);
create unique index craftsmen_google_place_uniq on public.craftsmen(google_place_id) where google_place_id is not null;

-- opt-out requests: "this is my workshop, remove me"
create table public.opt_out_requests (
  id uuid primary key default gen_random_uuid(),
  craftsman_id uuid not null references public.craftsmen(id) on delete cascade,
  reason text,
  contact_email text,
  created_at timestamptz default now(),
  resolved boolean default false,
  resolved_at timestamptz
);

-- contact clicks: basic analytics about which info users click
create table public.contact_clicks (
  id uuid primary key default gen_random_uuid(),
  craftsman_id uuid not null references public.craftsmen(id) on delete cascade,
  action text not null check (action in ('phone', 'website', 'viber', 'whatsapp', 'email')),
  created_at timestamptz default now()
);

create index contact_clicks_craftsman_idx on public.contact_clicks(craftsman_id);

-- updated_at trigger for craftsmen
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger craftsmen_set_updated_at
  before update on public.craftsmen
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.categories enable row level security;
alter table public.neighborhoods enable row level security;
alter table public.craftsmen enable row level security;
alter table public.opt_out_requests enable row level security;
alter table public.contact_clicks enable row level security;

-- Public read for reference tables
create policy "categories are public" on public.categories for select using (true);
create policy "neighborhoods are public" on public.neighborhoods for select using (true);

-- Public read only for live craftsmen (pending + paid)
create policy "live craftsmen are public" on public.craftsmen
  for select using (status in ('pending', 'paid'));

-- Anyone may submit an opt-out request
create policy "anyone can submit opt-out" on public.opt_out_requests
  for insert with check (true);

-- Anyone may log a contact click
create policy "anyone can log contact click" on public.contact_clicks
  for insert with check (true);

-- Admin writes require service-role key (used from server-side admin routes).
-- No public insert/update/delete policies = blocked by RLS for anon/authenticated.
