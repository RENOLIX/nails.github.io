-- Execute this after supabase-nails-admin.sql.
-- It inserts the current site catalogue into the real Supabase products table.

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Vernis Canni CC1',
  'CC1',
  'Vernis gel professionnel, couvrance elegante et tenue brillante pour poses salon.',
  'vernis',
  'canni',
  850,
  1000,
  'https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6',
  '["https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6","https://hercules-cdn.com/file_8r6fY6tok9GV86nd3obHx0NV","https://hercules-cdn.com/file_UmIrFdNvYGhn1kdpHrsPAtmN"]'::jsonb,
  true,
  false,
  true
where not exists (select 1 from public.products where reference = 'CC1');

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Vernis Canni CC2',
  'CC2',
  'Vernis gel Canni avec brillance intense, parfait pour les poses quotidiennes.',
  'vernis',
  'canni',
  850,
  null,
  'https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6',
  '["https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6","https://hercules-cdn.com/file_8r6fY6tok9GV86nd3obHx0NV"]'::jsonb,
  false,
  true,
  true
where not exists (select 1 from public.products where reference = 'CC2');

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Vernis Canni CC5',
  'CC5',
  'Teinte Canni professionnelle, application fluide et fini propre apres catalysation.',
  'vernis',
  'canni',
  850,
  null,
  'https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6',
  '["https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6","https://hercules-cdn.com/file_UmIrFdNvYGhn1kdpHrsPAtmN"]'::jsonb,
  false,
  false,
  true
where not exists (select 1 from public.products where reference = 'CC5');

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Vernis Canni CC7',
  'CC7',
  'Couleur Canni elegante pour manucures nettes, brillantes et longue tenue.',
  'vernis',
  'canni',
  850,
  null,
  'https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6',
  '["https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6","https://hercules-cdn.com/file_qD1QGZqzNqF1W3KVnpE3x63l"]'::jsonb,
  true,
  false,
  true
where not exists (select 1 from public.products where reference = 'CC7');

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Vernis Venalisa A2',
  'A2',
  'Teinte douce, application fluide, finition lumineuse pour manucures naturelles.',
  'vernis',
  'venalisa',
  950,
  null,
  'https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6',
  '["https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6","https://hercules-cdn.com/file_qD1QGZqzNqF1W3KVnpE3x63l"]'::jsonb,
  false,
  true,
  true
where not exists (select 1 from public.products where reference = 'A2');

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Base Coat Canni',
  'BC-CANNI',
  'Base adherente pour preparer l''ongle et prolonger la tenue de votre pose.',
  'coats',
  'canni',
  900,
  null,
  'https://hercules-cdn.com/file_8r6fY6tok9GV86nd3obHx0NV',
  '["https://hercules-cdn.com/file_8r6fY6tok9GV86nd3obHx0NV","https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6"]'::jsonb,
  true,
  false,
  true
where not exists (select 1 from public.products where reference = 'BC-CANNI');

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Builder Gel Venalisa',
  'BG-VENA',
  'Gel de construction stable, ideal pour gainage, renforcement et extensions.',
  'gels',
  'venalisa',
  1450,
  1650,
  'https://hercules-cdn.com/file_UmIrFdNvYGhn1kdpHrsPAtmN',
  '["https://hercules-cdn.com/file_UmIrFdNvYGhn1kdpHrsPAtmN","https://hercules-cdn.com/file_kGUpxK72XaaIBgGOIXY7vrxZ"]'::jsonb,
  false,
  true,
  true
where not exists (select 1 from public.products where reference = 'BG-VENA');

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Pinceau Liner Pro',
  'BR-LINER',
  'Pinceau fin pour nail art, traits precis, french et details decoratifs.',
  'pinceau',
  null,
  650,
  null,
  'https://hercules-cdn.com/file_0k64ARE9trLk3yCFUeM3TwqG',
  '["https://hercules-cdn.com/file_0k64ARE9trLk3yCFUeM3TwqG","https://hercules-cdn.com/file_qD1QGZqzNqF1W3KVnpE3x63l"]'::jsonb,
  false,
  false,
  true
where not exists (select 1 from public.products where reference = 'BR-LINER');

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Capsules Soft Square',
  'CAP-SQ',
  'Capsules resistantes et faciles a limer pour un rendu net et confortable.',
  'capsules',
  null,
  1200,
  null,
  'https://hercules-cdn.com/file_kGUpxK72XaaIBgGOIXY7vrxZ',
  '["https://hercules-cdn.com/file_kGUpxK72XaaIBgGOIXY7vrxZ","https://hercules-cdn.com/file_C74VROiqXB1r39qCix3wF2Bs"]'::jsonb,
  true,
  false,
  true
where not exists (select 1 from public.products where reference = 'CAP-SQ');

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Poudre Chrome',
  'CHR-01',
  'Effet miroir ultra lumineux pour finitions tendance et creations premium.',
  'decoration',
  'poudre',
  700,
  null,
  'https://hercules-cdn.com/file_qD1QGZqzNqF1W3KVnpE3x63l',
  '["https://hercules-cdn.com/file_qD1QGZqzNqF1W3KVnpE3x63l","https://hercules-cdn.com/file_P6Bb0DrBd4FZQXdNswwBIbH6"]'::jsonb,
  false,
  true,
  true
where not exists (select 1 from public.products where reference = 'CHR-01');

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Lampe UV LED',
  'LED-48W',
  'Appareil de catalysation rapide avec minuterie, adapte aux gels et vernis semi-permanents.',
  'appareil',
  null,
  4200,
  null,
  'https://hercules-cdn.com/file_J0OFplWLXsf3YDE3UhO57xTp',
  '["https://hercules-cdn.com/file_J0OFplWLXsf3YDE3UhO57xTp","https://hercules-cdn.com/file_5PMdmdYL1K4dAOwTB9Ql7YyW"]'::jsonb,
  true,
  false,
  true
where not exists (select 1 from public.products where reference = 'LED-48W');

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Kit Tools Manucure',
  'KIT-TOOLS',
  'Essentiels de preparation et finition pour une pose propre et professionnelle.',
  'tools',
  null,
  1850,
  null,
  'https://hercules-cdn.com/file_5PMdmdYL1K4dAOwTB9Ql7YyW',
  '["https://hercules-cdn.com/file_5PMdmdYL1K4dAOwTB9Ql7YyW","https://hercules-cdn.com/file_0k64ARE9trLk3yCFUeM3TwqG"]'::jsonb,
  false,
  false,
  true
where not exists (select 1 from public.products where reference = 'KIT-TOOLS');

insert into public.products (
  name, reference, description, category, subcategory, price, old_price,
  image_url, images, is_best_seller, is_new, active
)
select
  'Glue Pro Capsules',
  'GLUE-PRO',
  'Colle precise et resistante pour capsules, tips et reparations rapides.',
  'glue',
  null,
  450,
  null,
  'https://hercules-cdn.com/file_C74VROiqXB1r39qCix3wF2Bs',
  '["https://hercules-cdn.com/file_C74VROiqXB1r39qCix3wF2Bs","https://hercules-cdn.com/file_kGUpxK72XaaIBgGOIXY7vrxZ"]'::jsonb,
  false,
  false,
  true
where not exists (select 1 from public.products where reference = 'GLUE-PRO');
