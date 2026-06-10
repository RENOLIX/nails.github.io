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
    'products',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'id', p.id,
              'name', p.name,
              'reference', p.reference,
              'description', p.description,
              'category', p.category,
              'subcategory', p.subcategory,
              'price', p.price,
              'old_price', p.old_price,
              'image_url', null,
              'images', '[]'::jsonb,
              'stock', p.stock,
              'canni_collection', p.canni_collection,
              'colors', p.colors,
              'is_best_seller', p.is_best_seller,
              'is_new', p.is_new,
              'active', p.active,
              'created_at', p.created_at
            )
            order by p.created_at desc
          )
          from public.products p
        ),
        '[]'::jsonb
      ),
    'orders',
      coalesce(
        (select jsonb_agg(to_jsonb(o) order by o.created_at desc) from public.orders o),
        '[]'::jsonb
      ),
    'reviews',
      coalesce(
        (select jsonb_agg(to_jsonb(r) order by r.created_at desc) from public.reviews r),
        '[]'::jsonb
      ),
    'product_requests',
      coalesce(
        (select jsonb_agg(to_jsonb(pr) order by pr.created_at desc) from public.product_requests pr),
        '[]'::jsonb
      ),
    'users',
      case
        when account.role = 'admin' then
          coalesce(
            (
              select jsonb_agg(to_jsonb(u) - 'password_hash' order by u.created_at desc)
              from public.admin_users u
            ),
            '[]'::jsonb
          )
        else jsonb_build_array(to_jsonb(account) - 'password_hash')
      end
  );
end;
$$;

create or replace function public.admin_product_detail(session_token text, product_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  account public.admin_users;
  selected_product public.products;
begin
  account := public.private_admin_from_token(session_token);

  select *
  into selected_product
  from public.products
  where products.id = product_id;

  if selected_product.id is null then
    raise exception 'Product not found';
  end if;

  return to_jsonb(selected_product);
end;
$$;

grant execute on function public.admin_dashboard_data(text) to anon;
grant execute on function public.admin_product_detail(text, uuid) to anon;
