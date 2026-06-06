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
  stock integer not null default 20 check (stock >= 0),
  canni_collection text,
  colors jsonb not null default '[]'::jsonb,
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

alter table public.products add column if not exists stock integer not null default 20;
alter table public.products add column if not exists canni_collection text;
alter table public.products add column if not exists colors jsonb not null default '[]'::jsonb;
update public.products set stock = 20 where stock is null;
update public.products
set canni_collection = lower(reference)
where category = 'vernis'
  and subcategory = 'canni'
  and upper(reference) in ('CC1', 'CC2', 'CC3', 'CC4', 'CC5', 'CC6', 'CC7', 'CC8')
  and canni_collection is null;

alter table public.products drop constraint if exists products_canni_collection_check;
alter table public.products
  add constraint products_canni_collection_check
  check (canni_collection is null or canni_collection in ('cc1', 'cc2', 'cc3', 'cc4', 'cc5', 'cc6', 'cc7', 'cc8'));
update public.orders set status = 'pending' where status = 'new';
update public.orders set status = 'pending' where status not in ('pending', 'confirmed', 'cancelled');

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check check (status in ('pending', 'confirmed', 'cancelled'));

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
set search_path = public, extensions
as $$
declare
  account public.admin_users;
begin
  delete from public.admin_sessions where expires_at < now();

  select u.*
    into account
  from public.admin_sessions s
  join public.admin_users u on u.id = s.user_id
  where s.token_hash = encode(extensions.digest(session_token, 'sha256'), 'hex')
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
set search_path = public, extensions
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

  if account.id is null or account.password_hash <> extensions.crypt(login_password, account.password_hash) then
    raise exception 'Invalid credentials';
  end if;

  raw_token := encode(extensions.gen_random_bytes(32), 'hex');

  insert into public.admin_sessions (user_id, token_hash, expires_at)
  values (account.id, encode(extensions.digest(raw_token, 'sha256'), 'hex'), now() + interval '14 days');

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
set search_path = public, extensions
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
set search_path = public, extensions
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
    stock,
    canni_collection,
    colors,
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
    greatest(coalesce((product->>'stock')::integer, 0), 0),
    nullif(product->>'canni_collection', ''),
    coalesce(product->'colors', '[]'::jsonb),
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
set search_path = public, extensions
as $$
declare
  account public.admin_users;
begin
  account := public.private_admin_from_token(session_token);

  delete from public.products where products.id = product_id;

  return jsonb_build_object('deleted', true);
end;
$$;

create or replace function public.admin_update_product(session_token text, product_id uuid, product jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  account public.admin_users;
  updated public.products;
begin
  account := public.private_admin_from_token(session_token);

  update public.products
  set
    name = product->>'name',
    reference = nullif(product->>'reference', ''),
    description = nullif(product->>'description', ''),
    category = product->>'category',
    subcategory = nullif(product->>'subcategory', ''),
    price = (product->>'price')::numeric,
    old_price = nullif(product->>'old_price', '')::numeric,
    image_url = nullif(product->>'image_url', ''),
    images = coalesce(product->'images', '[]'::jsonb),
    stock = greatest(coalesce((product->>'stock')::integer, 0), 0),
    canni_collection = nullif(product->>'canni_collection', ''),
    colors = coalesce(product->'colors', '[]'::jsonb),
    is_best_seller = coalesce((product->>'is_best_seller')::boolean, false),
    is_new = coalesce((product->>'is_new')::boolean, false),
    active = true
  where products.id = product_id
  returning * into updated;

  if updated.id is null then
    raise exception 'Product not found';
  end if;

  return to_jsonb(updated);
end;
$$;

create or replace function public.admin_update_order(session_token text, order_id uuid, order_data jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  account public.admin_users;
  updated public.orders;
  next_status text;
begin
  account := public.private_admin_from_token(session_token);
  next_status := coalesce(nullif(order_data->>'status', ''), 'pending');

  if next_status not in ('pending', 'confirmed', 'cancelled') then
    raise exception 'Invalid order status';
  end if;

  update public.orders
  set
    customer_name = coalesce(nullif(order_data->>'customer_name', ''), customer_name),
    customer_phone = coalesce(nullif(order_data->>'customer_phone', ''), customer_phone),
    wilaya = nullif(order_data->>'wilaya', ''),
    address = nullif(order_data->>'address', ''),
    delivery_method = coalesce(nullif(order_data->>'delivery_method', ''), delivery_method),
    note = nullif(order_data->>'note', ''),
    status = next_status
  where orders.id = order_id
  returning * into updated;

  if updated.id is null then
    raise exception 'Order not found';
  end if;

  return to_jsonb(updated);
end;
$$;

create or replace function public.create_public_order(order_data jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  inserted public.orders;
  item jsonb;
  matched_product public.products;
  requested_quantity integer;
begin
  for item in select * from jsonb_array_elements(coalesce(order_data->'items', '[]'::jsonb))
  loop
    matched_product := null;
    requested_quantity := greatest(coalesce((item->>'quantity')::integer, 1), 1);
    select *
      into matched_product
    from public.products
    where id::text = item->>'id'
      and active = true
    for update;

    if matched_product.id is not null and matched_product.stock < requested_quantity then
      raise exception 'Stock insuffisant pour %', matched_product.name;
    end if;
  end loop;

  insert into public.orders (
    customer_name,
    customer_phone,
    wilaya,
    address,
    delivery_method,
    note,
    items,
    subtotal,
    shipping,
    total,
    status
  )
  values (
    order_data->>'customer_name',
    order_data->>'customer_phone',
    nullif(order_data->>'wilaya', ''),
    nullif(order_data->>'address', ''),
    nullif(order_data->>'delivery_method', ''),
    nullif(order_data->>'note', ''),
    coalesce(order_data->'items', '[]'::jsonb),
    coalesce((order_data->>'subtotal')::numeric, 0),
    coalesce((order_data->>'shipping')::numeric, 0),
    coalesce((order_data->>'total')::numeric, 0),
    'pending'
  )
  returning * into inserted;

  for item in select * from jsonb_array_elements(coalesce(order_data->'items', '[]'::jsonb))
  loop
    requested_quantity := greatest(coalesce((item->>'quantity')::integer, 1), 1);
    update public.products
    set stock = greatest(stock - requested_quantity, 0)
    where id::text = item->>'id'
      and active = true;
  end loop;

  return to_jsonb(inserted);
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
set search_path = public, extensions
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
  values (lower(new_email), new_name, new_role, extensions.crypt(new_password, extensions.gen_salt('bf')), true)
  returning * into inserted;

  return to_jsonb(inserted) - 'password_hash';
end;
$$;

create or replace function public.admin_delete_user(session_token text, target_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
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
grant execute on function public.admin_update_product(text, uuid, jsonb) to anon;
grant execute on function public.admin_update_order(text, uuid, jsonb) to anon;
grant execute on function public.admin_delete_product(text, uuid) to anon;
grant execute on function public.admin_create_user(text, text, text, text, text) to anon;
grant execute on function public.admin_delete_user(text, uuid) to anon;
grant execute on function public.create_public_order(jsonb) to anon;

insert into public.products (
  name,
  reference,
  description,
  category,
  subcategory,
  price,
  image_url,
  images,
  stock,
  canni_collection,
  colors,
  is_best_seller,
  is_new,
  active
)
select
  'Vernis Canni CC' || collection_number,
  'CC' || collection_number,
  'Collection Canni CC' || collection_number || ' disponible dans plusieurs couleurs.',
  'vernis',
  'canni',
  850,
  'https://renolix.github.io/nails.github.io/images/canni/cc' || collection_number || '.webp',
  jsonb_build_array('https://renolix.github.io/nails.github.io/images/canni/cc' || collection_number || '.webp'),
  20,
  'cc' || collection_number,
  '[]'::jsonb,
  false,
  collection_number = 8,
  true
from generate_series(1, 8) as seed(collection_number)
where not exists (
  select 1
  from public.products
  where canni_collection = 'cc' || collection_number
);

insert into public.admin_users (email, name, role, password_hash, active)
values (
  'admin@nailsymagic.com',
  'Nailsy Magic Admin',
  'admin',
  extensions.crypt('NailsyMagic2026!', extensions.gen_salt('bf')),
  true
)
on conflict (email) do update set
  name = excluded.name,
  role = 'admin',
  password_hash = excluded.password_hash,
  active = true;
