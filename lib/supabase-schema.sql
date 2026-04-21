-- ============================================================
-- SUPABASE SCHEMA — Run this in Supabase SQL Editor
-- ============================================================

-- 1. Products table
create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  tagline       text not null default '',
  price_kgs     integer not null default 0,
  currency      text not null default 'KGS',
  image         text not null default '',
  images        text[] not null default '{}',
  category      text not null default 'iPhone',
  description   text not null default '',
  specs         jsonb not null default '{}',
  stock_status  boolean not null default true,
  featured      boolean not null default false,
  new_product   boolean not null default false,
  badge         text,
  rating        numeric(3,1),
  review_count  integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- 3. Row Level Security — allow public reads, auth writes
alter table products enable row level security;

create policy "Public can read products"
  on products for select using (true);

create policy "Authenticated can insert"
  on products for insert to authenticated with check (true);

create policy "Authenticated can update"
  on products for update to authenticated using (true);

create policy "Authenticated can delete"
  on products for delete to authenticated using (true);

-- 4. For demo/admin without auth, also allow anon writes
-- (Remove in production and use proper Auth)
create policy "Anon can insert for demo"
  on products for insert to anon with check (true);

create policy "Anon can update for demo"
  on products for update to anon using (true);

create policy "Anon can delete for demo"
  on products for delete to anon using (true);

-- 5. Storage bucket (run in Storage settings or SQL)
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

-- 6. Storage RLS
-- create policy "Public read" on storage.objects for select using (bucket_id = 'product-images');
-- create policy "Anon upload" on storage.objects for insert to anon with check (bucket_id = 'product-images');
-- create policy "Anon delete" on storage.objects for delete to anon using (bucket_id = 'product-images');

-- 7. Seed data — 12 products
insert into products (name, tagline, price_kgs, image, images, category, description, specs, stock_status, featured, badge, rating, review_count) values
(
  'MacBook Pro 16"', 'Mind-blowingly fast.', 149900,
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceback-select-202310?wid=800&hei=800&fmt=jpeg&qlt=90',
  ARRAY['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceback-select-202310?wid=800&hei=800&fmt=jpeg&qlt=90'],
  'MacBook',
  'MacBook Pro 16" with M3 Pro chip, 18GB RAM, 512GB SSD. The most powerful Mac laptop ever built.',
  '{"Chip":"Apple M3 Pro","Memory":"18GB Unified Memory","Storage":"512GB SSD","Display":"16.2-inch Liquid Retina XDR","Battery":"Up to 22 hours"}',
  true, true, 'New', 4.9, 348
),
(
  'MacBook Pro 14"', 'Pro. To the max.', 119900,
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-silver-select-202310?wid=800&hei=800&fmt=jpeg&qlt=90',
  ARRAY['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-silver-select-202310?wid=800&hei=800&fmt=jpeg&qlt=90'],
  'MacBook', 'MacBook Pro 14" with M3 chip, 8GB RAM, 512GB SSD.',
  '{"Chip":"Apple M3","Memory":"8GB","Storage":"512GB SSD","Display":"14.2-inch Liquid Retina XDR","Battery":"Up to 11 hours"}',
  true, true, null, 4.8, 221
),
(
  'MacBook Air 15"', 'Impressively big. Impossibly thin.', 89900,
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-midnight-select-202402?wid=800&hei=800&fmt=jpeg&qlt=90',
  ARRAY['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-midnight-select-202402?wid=800&hei=800&fmt=jpeg&qlt=90'],
  'MacBook', 'MacBook Air 15" with M3 chip.',
  '{"Chip":"Apple M3","Memory":"8GB","Storage":"256GB SSD","Display":"15.3-inch Liquid Retina","Battery":"Up to 18 hours"}',
  true, false, 'Popular', 4.7, 512
),
(
  'iPhone 15 Pro Max', 'Titanium. So strong. So light. So Pro.', 89900,
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=jpeg&qlt=90',
  ARRAY['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=jpeg&qlt=90'],
  'iPhone', 'iPhone 15 Pro Max with A17 Pro chip. 6.7-inch Super Retina XDR display.',
  '{"Chip":"A17 Pro","Display":"6.7-inch Super Retina XDR","Camera":"48MP Main","Storage":"256GB","Battery":"Up to 29 hours"}',
  true, true, 'New', 4.9, 1024
),
(
  'iPhone 15', 'A total switchover.', 59900,
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=800&hei=800&fmt=jpeg&qlt=90',
  ARRAY['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=800&hei=800&fmt=jpeg&qlt=90'],
  'iPhone', 'iPhone 15 with Dynamic Island, 48MP camera, and USB-C.',
  '{"Chip":"A16 Bionic","Display":"6.1-inch Super Retina XDR","Camera":"48MP Main","Storage":"128GB"}',
  true, false, null, 4.7, 876
),
(
  'iPad Pro 13"', 'Thin. Powerful. Magical.', 99900,
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-silver?wid=800&hei=800&fmt=jpeg&qlt=90',
  ARRAY['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-silver?wid=800&hei=800&fmt=jpeg&qlt=90'],
  'iPad', 'iPad Pro 13" with M4 chip.',
  '{"Chip":"Apple M4","Display":"13-inch Ultra Retina XDR OLED","Storage":"256GB"}',
  false, true, 'New', 4.8, 203
),
(
  'Apple Watch Ultra 2', 'Next-level adventure.', 69900,
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-case-49-titanium-ultra2_VW_34FR+watch-face-49-alpine-ultra2_VW_34FR?wid=800&hei=800&fmt=jpeg&qlt=90',
  ARRAY['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-case-49-titanium-ultra2_VW_34FR+watch-face-49-alpine-ultra2_VW_34FR?wid=800&hei=800&fmt=jpeg&qlt=90'],
  'Apple Watch', 'Apple Watch Ultra 2 with titanium case and up to 60 hours battery.',
  '{"Case":"49mm Titanium","Battery":"Up to 60 hours","Chip":"S9 SiP","Water Resistance":"100m"}',
  true, false, null, 4.9, 187
),
(
  'AirPods Pro (2nd gen)', 'Adaptive Audio. Now playing.', 24900,
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=800&hei=800&fmt=jpeg&qlt=90',
  ARRAY['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=800&hei=800&fmt=jpeg&qlt=90'],
  'AirPods', 'AirPods Pro 2nd generation with H2 chip and Adaptive Audio.',
  '{"Chip":"H2","ANC":"Active Noise Cancellation","Battery":"Up to 30 hours with case","Charging":"USB-C / MagSafe"}',
  true, false, 'Popular', 4.8, 1543
),
(
  'Samsung Galaxy S24 Ultra', 'The AI smartphone of the future.', 79900,
  'https://images.samsung.com/us/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titaniumblack-back.jpg',
  ARRAY['https://images.samsung.com/us/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titaniumblack-back.jpg'],
  'Samsung', 'Samsung Galaxy S24 Ultra with built-in S Pen and 200MP camera.',
  '{"Chip":"Snapdragon 8 Gen 3","Display":"6.8-inch QHD+ Dynamic AMOLED","Camera":"200MP","Storage":"256GB","Battery":"5000mAh"}',
  true, false, null, 4.7, 654
),
(
  'Sony WH-1000XM5', 'Industry-leading noise cancellation.', 29900,
  'https://m.media-amazon.com/images/I/61vJPLPsxxL._AC_SX679_.jpg',
  ARRAY['https://m.media-amazon.com/images/I/61vJPLPsxxL._AC_SX679_.jpg'],
  'Headphones', 'Sony WH-1000XM5 with 8 microphones and 30-hour battery.',
  '{"Driver":"30mm","Frequency":"4Hz-40000Hz","Battery":"30 hours","Charging":"USB-C","Weight":"250g"}',
  true, false, null, 4.8, 2341
),
(
  'LG UltraFine 5K Display', 'See everything in stunning 5K.', 59900,
  'https://m.media-amazon.com/images/I/71YNTiVhnSL._AC_SX679_.jpg',
  ARRAY['https://m.media-amazon.com/images/I/71YNTiVhnSL._AC_SX679_.jpg'],
  'Monitors', '27-inch 5K Retina display designed for Mac.',
  '{"Resolution":"5120x2880 (5K)","Size":"27-inch","Brightness":"500 nits","Color":"P3 Wide","Ports":"3x USB-C"}',
  false, false, null, 4.6, 189
),
(
  'PlayStation 5 + DualSense', 'Feel the future of gaming.', 49900,
  'https://m.media-amazon.com/images/I/619K9X1gEFL._AC_SX679_.jpg',
  ARRAY['https://m.media-amazon.com/images/I/619K9X1gEFL._AC_SX679_.jpg'],
  'Gaming', 'PlayStation 5 with DualSense. Lightning-fast loading and haptic feedback.',
  '{"CPU":"AMD Zen 2 @ 3.5GHz","GPU":"AMD RDNA 2","Storage":"825GB NVMe SSD","Resolution":"Up to 8K"}',
  true, false, 'Popular', 4.9, 3210
);

-- 8. Leads table for tracking customer inquiries and sales
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null,
  whatsapp      text not null,
  address       text,
  email         text,
  product_id    uuid references products(id) on delete set null,
  product_name  text not null,
  category      text not null,
  message       text,
  total_amount  integer,
  source        text not null default 'checkout', -- checkout, product_page, homepage
  status        text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed', 'lost')),
  priority      text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  contacted_at  timestamptz
);

-- 9. Auto-update updated_at for leads
create trigger leads_updated_at
  before update on leads
  for each row execute function update_updated_at();

-- 10. Row Level Security for leads
alter table leads enable row level security;

create policy "Public can insert leads"
  on leads for insert to anon with check (true);

create policy "Authenticated can read leads"
  on leads for select to authenticated using (true);

create policy "Authenticated can update leads"
  on leads for update to authenticated using (true);

create policy "Authenticated can delete leads"
  on leads for delete to authenticated using (true);

-- 11. Indexes for better performance
create index idx_leads_status on leads(status);
create index idx_leads_created_at on leads(created_at desc);
create index idx_leads_product_id on leads(product_id);
create index idx_leads_source on leads(source);
