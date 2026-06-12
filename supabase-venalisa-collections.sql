alter table public.products drop constraint if exists products_canni_collection_check;

alter table public.products
  add constraint products_canni_collection_check
  check (
    canni_collection is null
    or canni_collection in (
      'cc1', 'cc2', 'cc3', 'cc4', 'cc5', 'cc6', 'cc7', 'cc8',
      'neon-gel', 'gel-v6', 'rubber-base'
    )
  );

update public.products
set canni_collection = 'neon-gel'
where category = 'vernis'
  and subcategory = 'venalisa'
  and (
    lower(name) ~ 'neon[[:space:]]*gel[[:space:]]*nh[1-6]'
    or upper(coalesce(reference, '')) in ('NH1', 'NH2', 'NH3', 'NH4', 'NH5', 'NH6')
  );

update public.products
set canni_collection = 'gel-v6'
where category = 'vernis'
  and subcategory = 'venalisa'
  and (
    lower(name) ~ 'venalisa[[:space:]]*(509[1-9]|510[0-8])'
    or upper(coalesce(reference, '')) in (
      '5091', '5092', '5093', '5094', '5095', '5096', '5097', '5098', '5099',
      '5100', '5101', '5102', '5103', '5104', '5105', '5106', '5107', '5108'
    )
  );

update public.products
set canni_collection = 'rubber-base'
where category = 'vernis'
  and subcategory = 'venalisa'
  and lower(name) ~ 'rubber[[:space:]]*base[[:space:]]*(01|03)';

update public.products
set category = 'pack'
where category = 'glue';
