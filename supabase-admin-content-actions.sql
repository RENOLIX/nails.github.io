create or replace function public.admin_delete_order(session_token text, order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  account public.admin_users;
begin
  account := public.private_admin_from_token(session_token);
  delete from public.orders where orders.id = order_id;
  return jsonb_build_object('deleted', true);
end;
$$;

create or replace function public.admin_set_review_approval(
  session_token text,
  review_id uuid,
  next_approved boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  account public.admin_users;
  updated public.reviews;
begin
  account := public.private_admin_from_token(session_token);

  update public.reviews
  set approved = next_approved
  where reviews.id = review_id
  returning * into updated;

  if updated.id is null then
    raise exception 'Review not found';
  end if;

  return to_jsonb(updated);
end;
$$;

create or replace function public.admin_delete_review(session_token text, review_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  account public.admin_users;
begin
  account := public.private_admin_from_token(session_token);
  delete from public.reviews where reviews.id = review_id;
  return jsonb_build_object('deleted', true);
end;
$$;

create or replace function public.admin_delete_product_request(session_token text, request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  account public.admin_users;
begin
  account := public.private_admin_from_token(session_token);
  delete from public.product_requests where product_requests.id = request_id;
  return jsonb_build_object('deleted', true);
end;
$$;

grant execute on function public.admin_delete_order(text, uuid) to anon;
grant execute on function public.admin_set_review_approval(text, uuid, boolean) to anon;
grant execute on function public.admin_delete_review(text, uuid) to anon;
grant execute on function public.admin_delete_product_request(text, uuid) to anon;
