create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  role text not null check (role in ('admin', 'employee')),
  password_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.admin_users(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  reference text,
  description text,
  category text not null,
  subcategory text,
  price numeric not null default 0,
  old_price numeric,
  image_url text,
  images jsonb not null default '[]'::jsonb,
  is_best_seller boolean not null default false,
  is_new boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  wilaya text,
  address text,
  delivery_method text,
  note text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating integer not null check (rating between 1 and 5),
  message text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.product_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  product text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.admin_sessions enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.product_requests enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
  on public.products for select
  using (active = true);

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
  on public.orders for insert
  with check (true);

drop policy if exists "Public can create reviews" on public.reviews;
create policy "Public can create reviews"
  on public.reviews for insert
  with check (true);

drop policy if exists "Public can read approved reviews" on public.reviews;
create policy "Public can read approved reviews"
  on public.reviews for select
  using (approved = true);

drop policy if exists "Public can create product requests" on public.product_requests;
create policy "Public can create product requests"
  on public.product_requests for insert
  with check (true);

grant usage on schema public to anon;
grant select on public.products to anon;
grant insert on public.orders to anon;
grant select, insert on public.reviews to anon;
grant insert on public.product_requests to anon;

create or replace function public.private_admin_from_token(session_token text)
returns public.admin_users
language plpgsql
security definer
set search_path = public
as $$
declare
  account public.admin_users;
begin
  delete from public.admin_sessions where expires_at < now();

  select u.*
    into account
  from public.admin_sessions s
  join public.admin_users u on u.id = s.user_id
  where s.token_hash = encode(digest(session_token, 'sha256'), 'hex')
    and s.expires_at > now()
    and u.active = true
  limit 1;

  if account.id is null then
    raise exception 'Invalid admin session';
  end if;

  return account;
end;
$$;

create or replace function public.admin_login(login_email text, login_password text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  account public.admin_users;
  raw_token text;
begin
  select *
    into account
  from public.admin_users
  where lower(email) = lower(login_email)
    and active = true
  limit 1;

  if account.id is null or account.password_hash <> crypt(login_password, account.password_hash) then
    raise exception 'Invalid credentials';
  end if;

  raw_token := encode(gen_random_bytes(32), 'hex');

  insert into public.admin_sessions (user_id, token_hash, expires_at)
  values (account.id, encode(digest(raw_token, 'sha256'), 'hex'), now() + interval '14 days');

  return jsonb_build_object(
    'token', raw_token,
    'user', jsonb_build_object(
      'id', account.id,
      'email', account.email,
      'name', account.name,
      'role', account.role,
      'active', account.active,
      'created_at', account.created_at
    )
  );
end;
$$;

create or replace function public.admin_dashboard_data(session_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  account public.admin_users;
begin
  account := public.private_admin_from_token(session_token);

  return jsonb_build_object(
    'products', coalesce((select jsonb_agg(to_jsonb(p) order by p.created_at desc) from public.products p), '[]'::jsonb),
    'orders', coalesce((select jsonb_agg(to_jsonb(o) order by o.created_at desc) from public.orders o), '[]'::jsonb),
    'reviews', coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.reviews r), '[]'::jsonb),
    'product_requests', coalesce((select jsonb_agg(to_jsonb(pr) order by pr.created_at desc) from public.product_requests pr), '[]'::jsonb),
    'users', case
      when account.role = 'admin' then coalesce((select jsonb_agg(to_jsonb(u) - 'password_hash' order by u.created_at desc) from public.admin_users u), '[]'::jsonb)
      else jsonb_build_array(to_jsonb(account) - 'password_hash')
    end
  );
end;
$$;

create or replace function public.admin_create_product(session_token text, product jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  account public.admin_users;
  inserted public.products;
begin
  account := public.private_admin_from_token(session_token);

  insert into public.products (
    name,
    reference,
    description,
    category,
    subcategory,
    price,
    old_price,
    image_url,
    images,
    is_best_seller,
    is_new,
    active
  )
  values (
    product->>'name',
    nullif(product->>'reference', ''),
    nullif(product->>'description', ''),
    product->>'category',
    nullif(product->>'subcategory', ''),
    (product->>'price')::numeric,
    nullif(product->>'old_price', '')::numeric,
    nullif(product->>'image_url', ''),
    coalesce(product->'images', '[]'::jsonb),
    coalesce((product->>'is_best_seller')::boolean, false),
    coalesce((product->>'is_new')::boolean, false),
    true
  )
  returning * into inserted;

  return to_jsonb(inserted);
end;
$$;

create or replace function public.admin_delete_product(session_token text, product_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  account public.admin_users;
begin
  account := public.private_admin_from_token(session_token);

  delete from public.products where products.id = product_id;

  return jsonb_build_object('deleted', true);
end;
$$;

create or replace function public.admin_create_user(
  session_token text,
  new_email text,
  new_name text,
  new_role text,
  new_password text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  account public.admin_users;
  inserted public.admin_users;
begin
  account := public.private_admin_from_token(session_token);

  if account.role <> 'admin' then
    raise exception 'Only admins can create users';
  end if;

  if new_role not in ('admin', 'employee') then
    raise exception 'Invalid role';
  end if;

  if length(new_password) < 8 then
    raise exception 'Password must contain at least 8 characters';
  end if;

  insert into public.admin_users (email, name, role, password_hash, active)
  values (lower(new_email), new_name, new_role, crypt(new_password, gen_salt('bf')), true)
  returning * into inserted;

  return to_jsonb(inserted) - 'password_hash';
end;
$$;

create or replace function public.admin_delete_user(session_token text, target_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  account public.admin_users;
begin
  account := public.private_admin_from_token(session_token);

  if account.role <> 'admin' then
    raise exception 'Only admins can delete users';
  end if;

  if account.id = target_user_id then
    raise exception 'You cannot delete your own account';
  end if;

  delete from public.admin_users where id = target_user_id;

  return jsonb_build_object('deleted', true);
end;
$$;

grant execute on function public.admin_login(text, text) to anon;
grant execute on function public.admin_dashboard_data(text) to anon;
grant execute on function public.admin_create_product(text, jsonb) to anon;
grant execute on function public.admin_delete_product(text, uuid) to anon;
grant execute on function public.admin_create_user(text, text, text, text, text) to anon;
grant execute on function public.admin_delete_user(text, uuid) to anon;

insert into public.admin_users (email, name, role, password_hash, active)
values (
  'admin@nailsymagic.com',
  'Nailsy Magic Admin',
  'admin',
  crypt('NailsyMagic2026!', gen_salt('bf')),
  true
)
on conflict (email) do update set
  name = excluded.name,
  role = 'admin',
  password_hash = excluded.password_hash,
  active = true;
