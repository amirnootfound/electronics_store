-- ============================================================
-- SUPABASE SCHEMA — Universal Electronics Store
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Categories table (dynamic categories)
create table if not exists categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  slug          text not null unique,
  emoji         text,
  icon_url      text,
  description   text,
  parent_id     uuid references categories(id) on delete set null,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. Brands table (dynamic brands)
create table if not exists brands (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  slug          text not null unique,
  logo_url      text,
  website_url   text,
  description   text,
  is_featured   boolean not null default false,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 3. Spec Templates table (for different product categories)
create table if not exists spec_templates (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  category_id   uuid references categories(id) on delete cascade,
  template      jsonb not null default '{}', -- Key-value pairs with metadata
  is_default    boolean not null default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 4. Payment Methods table (dynamic payment options)
create table if not exists payment_methods (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  code          text not null unique,
  icon          text,
  description   text,
  is_active     boolean not null default true,
  requires_online_payment boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 5. Order Paths table (Online, Call/SMS, Pickup, Delivery)
create table if not exists order_paths (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  code          text not null unique,
  icon          text,
  description   text,
  is_active     boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 6. Products table (updated for universal store)
create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  tagline       text not null default '',
  price_usd     numeric(10,2) not null default 0, -- Changed to USD base
  currency      text not null default 'USD',
  image         text not null default '',
  images        text[] not null default '{}',
  category_id   uuid references categories(id) on delete set null,
  brand_id      uuid references brands(id) on delete set null,
  description   text not null default '',
  specs         jsonb not null default '{}',
  condition     text not null default 'new' check (condition in ('new', 'refurbished', 'used')),
  warranty      text,
  stock_status  boolean not null default true,
  featured      boolean not null default false,
  new_product   boolean not null default false,
  badge         text,
  rating        numeric(3,1),
  review_count  integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 7. Auto-update updated_at function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 8. Create updated_at triggers for all tables
create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

create trigger categories_updated_at
  before update on categories
  for each row execute function update_updated_at();

create trigger brands_updated_at
  before update on brands
  for each row execute function update_updated_at();

create trigger spec_templates_updated_at
  before update on spec_templates
  for each row execute function update_updated_at();

create trigger payment_methods_updated_at
  before update on payment_methods
  for each row execute function update_updated_at();

create trigger order_paths_updated_at
  before update on order_paths
  for each row execute function update_updated_at();

-- 9. Row Level Security — allow public reads, auth writes
alter table products enable row level security;
alter table categories enable row level security;
alter table brands enable row level security;
alter table spec_templates enable row level security;
alter table payment_methods enable row level security;
alter table order_paths enable row level security;

-- Products RLS
create policy "Public can read products"
  on products for select using (true);

create policy "Authenticated can insert products"
  on products for insert to authenticated with check (true);

create policy "Authenticated can update products"
  on products for update to authenticated using (true);

create policy "Authenticated can delete products"
  on products for delete to authenticated using (true);

create policy "Anon can insert products for demo"
  on products for insert to anon with check (true);

create policy "Anon can update products for demo"
  on products for update to anon using (true);

create policy "Anon can delete products for demo"
  on products for delete to anon using (true);

-- Categories RLS
create policy "Public can read categories"
  on categories for select using (true);

create policy "Authenticated can manage categories"
  on categories for all to authenticated using (true);

create policy "Anon can manage categories for demo"
  on categories for all to anon using (true);

-- Brands RLS
create policy "Public can read brands"
  on brands for select using (true);

create policy "Authenticated can manage brands"
  on brands for all to authenticated using (true);

create policy "Anon can manage brands for demo"
  on brands for all to anon using (true);

-- Spec Templates RLS
create policy "Public can read spec_templates"
  on spec_templates for select using (true);

create policy "Authenticated can manage spec_templates"
  on spec_templates for all to authenticated using (true);

create policy "Anon can manage spec_templates for demo"
  on spec_templates for all to anon using (true);

-- Payment Methods RLS
create policy "Public can read payment_methods"
  on payment_methods for select using (true);

create policy "Authenticated can manage payment_methods"
  on payment_methods for all to authenticated using (true);

create policy "Anon can manage payment_methods for demo"
  on payment_methods for all to anon using (true);

-- Order Paths RLS
create policy "Public can read order_paths"
  on order_paths for select using (true);

create policy "Authenticated can manage order_paths"
  on order_paths for all to authenticated using (true);

create policy "Anon can manage order_paths for demo"
  on order_paths for all to anon using (true);

-- 10. Storage bucket (run in Storage settings or SQL)
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

-- 11. Storage RLS
-- create policy "Public read" on storage.objects for select using (bucket_id = 'product-images');
-- create policy "Anon upload" on storage.objects for insert to anon with check (bucket_id = 'product-images');
-- create policy "Anon delete" on storage.objects for delete to anon using (bucket_id = 'product-images');

-- 12. Seed Categories
insert into categories (name, slug, emoji, description, display_order) values
('Laptops', 'laptops', '💻', 'High-performance laptops for work and gaming', 1),
('Smartphones', 'smartphones', '📱', 'Latest smartphones from top brands', 2),
('Tablets', 'tablets', '📟', 'Tablets for work, entertainment, and creativity', 3),
('Audio', 'audio', '🎧', 'Headphones, earbuds, and audio accessories', 4),
('Accessories', 'accessories', '⌚', 'Cases, chargers, and essential accessories', 5),
('Displays', 'displays', '🖥️', 'Monitors and displays for all needs', 6),
('TV & Home Theater', 'tv-home-theater', '📺', 'Televisions and home entertainment systems', 7),
('Gaming', 'gaming', '🎮', 'Gaming consoles, accessories, and equipment', 8)
on conflict (name) do nothing;

-- 13. Seed Brands
insert into brands (name, slug, logo_url, description, is_featured, display_order) values
('Apple', 'apple', null, 'Premium consumer electronics and software', true, 1),
('Samsung', 'samsung', null, 'Global leader in technology and innovation', true, 2),
('Dell', 'dell', null, 'Leading computer technology company', false, 3),
('Sony', 'sony', null, 'Entertainment and electronics giant', false, 4),
('Logitech', 'logitech', null, 'Computer peripherals and accessories', false, 5),
('Anker', 'anker', null, 'Charging technology and smart home devices', false, 6),
('LG', 'lg', null, 'Consumer electronics and home appliances', false, 7),
('Microsoft', 'microsoft', null, 'Software and consumer electronics', false, 8)
on conflict (name) do nothing;

-- 14. Seed Spec Templates for common categories
insert into spec_templates (name, category_id, template, is_default) values
('Laptop Template', (select id from categories where slug = 'laptops' limit 1),
 '{
   "Processor": {"type": "text", "required": true, "display_order": 1},
   "RAM": {"type": "text", "required": true, "display_order": 2},
   "Storage": {"type": "text", "required": true, "display_order": 3},
   "Display": {"type": "text", "required": true, "display_order": 4},
   "Graphics": {"type": "text", "required": false, "display_order": 5},
   "Battery": {"type": "text", "required": false, "display_order": 6},
   "Operating System": {"type": "text", "required": false, "display_order": 7}
 }', true),
('Smartphone Template', (select id from categories where slug = 'smartphones' limit 1),
 '{
   "Processor": {"type": "text", "required": true, "display_order": 1},
   "Display": {"type": "text", "required": true, "display_order": 2},
   "Camera": {"type": "text", "required": true, "display_order": 3},
   "Storage": {"type": "text", "required": true, "display_order": 4},
   "RAM": {"type": "text", "required": true, "display_order": 5},
   "Battery": {"type": "text", "required": false, "display_order": 6},
   "Operating System": {"type": "text", "required": false, "display_order": 7}
 }', true),
('Audio Template', (select id from categories where slug = 'audio' limit 1),
 '{
   "Driver Size": {"type": "text", "required": false, "display_order": 1},
   "Frequency Response": {"type": "text", "required": false, "display_order": 2},
   "Battery Life": {"type": "text", "required": true, "display_order": 3},
   "Noise Cancellation": {"type": "text", "required": false, "display_order": 4},
   "Connectivity": {"type": "text", "required": true, "display_order": 5},
   "Weight": {"type": "text", "required": false, "display_order": 6}
 }', true)
on conflict (name) do nothing;

-- 15. Seed Payment Methods (US-focused)
insert into payment_methods (name, code, icon, description, is_active, requires_online_payment, display_order) values
('Credit/Debit Card', 'card', '💳', 'Pay with Visa, Mastercard, American Express', true, true, 1),
('Apple Pay', 'apple-pay', '🍎', 'Fast and secure payment with Apple Pay', true, true, 2),
('Zelle', 'zelle', '🏦', 'Direct bank transfer via Zelle', true, false, 3),
('Cash on Pickup', 'cash-pickup', '💵', 'Pay with cash when picking up your order', true, false, 4),
('Pay in Store', 'pay-store', '🏪', 'Pay at our physical store location', true, false, 5)
on conflict (code) do nothing;

-- 16. Seed Order Paths
insert into order_paths (name, code, icon, description, is_active, display_order) values
('Online Order', 'online', '🌐', 'Complete your order online', true, 1),
('Direct Call', 'call', '📞', 'Call us to place your order', true, 2),
('SMS/Text', 'sms', '💬', 'Send us a text message to order', true, 3),
('Store Pickup', 'pickup', '🏪', 'Order online and pick up at our store', true, 4),
('Delivery', 'delivery', '🚚', 'Have your order delivered to your door', true, 5)
on conflict (code) do nothing;

-- 17. Seed Products — Mixed electronics catalog (USD prices)
insert into products (name, tagline, price_usd, image, images, category_id, brand_id, description, specs, stock_status, featured, badge, rating, review_count) values
(
  'iPhone 15 Pro Max', 'Titanium. So strong. So light. So Pro.', 1199.99,
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=jpeg&qlt=90',
  ARRAY['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=jpeg&qlt=90'],
  (select id from categories where slug = 'smartphones' limit 1),
  (select id from brands where slug = 'apple' limit 1),
  'iPhone 15 Pro Max with A17 Pro chip. 6.7-inch Super Retina XDR display.',
  '{"Processor":"A17 Pro","Display":"6.7-inch Super Retina XDR","Camera":"48MP Main","Storage":"256GB","Battery":"Up to 29 hours"}',
  true, true, 'New', 4.9, 1024
),
(
  'Dell XPS 15', 'Performance. Creation. Entertainment.', 1499.99,
  'https://i.dell.com/is/image/DellMarketing/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/x15-9530-cnb-00000ff090-gy-pk.psd',
  ARRAY['https://i.dell.com/is/image/DellMarketing/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/x15-9530-cnb-00000ff090-gy-pk.psd'],
  (select id from categories where slug = 'laptops' limit 1),
  (select id from brands where slug = 'dell' limit 1),
  'Dell XPS 15 with Intel Core i7, 32GB RAM, 1TB SSD. Perfect for creators.',
  '{"Processor":"Intel Core i7","RAM":"32GB DDR5","Storage":"1TB SSD","Display":"15.6-inch OLED 3.5K","Graphics":"NVIDIA RTX 4050","Battery":"Up to 12 hours"}',
  true, true, 'Popular', 4.7, 876
),
(
  'Sony WH-1000XM5', 'Industry-leading noise cancellation.', 349.99,
  'https://m.media-amazon.com/images/I/61vJPLPsxxL._AC_SX679_.jpg',
  ARRAY['https://m.media-amazon.com/images/I/61vJPLPsxxL._AC_SX679_.jpg'],
  (select id from categories where slug = 'audio' limit 1),
  (select id from brands where slug = 'sony' limit 1),
  'Sony WH-1000XM5 with 8 microphones and 30-hour battery life.',
  '{"Driver Size":"30mm","Frequency Response":"4Hz-40000Hz","Battery Life":"30 hours","Noise Cancellation":"Active","Connectivity":"Bluetooth 5.2","Weight":"250g"}',
  true, false, null, 4.8, 2341
),
(
  'Samsung 65" QLED 4K TV', 'Quantum Dot technology for brilliant color.', 899.99,
  'https://images.samsung.com/is/image/samsung/p6pim/us/qa65qn90bafxza/gallery/01-us-qa65qn90bafxza-538573618?$PD_GALLERY_PNG$',
  ARRAY['https://images.samsung.com/is/image/samsung/p6pim/us/qa65qn90bafxza/gallery/01-us-qa65qn90bafxza-538573618?$PD_GALLERY_PNG$'],
  (select id from categories where slug = 'tv-home-theater' limit 1),
  (select id from brands where slug = 'samsung' limit 1),
  'Samsung 65-inch QLED 4K Smart TV with Quantum Dot technology.',
  '{"Display":"65-inch QLED 4K","Resolution":"3840x2160","Smart TV":"Tizen","HDR":"HDR10+","Refresh Rate":"120Hz"}',
  true, false, null, 4.6, 654
),
(
  'Logitech MX Master 3S', 'Advanced wireless mouse for productivity.', 99.99,
  'https://m.media-amazon.com/images/I/61vJPLPsxxL._AC_SX679_.jpg',
  ARRAY['https://m.media-amazon.com/images/I/61vJPLPsxxL._AC_SX679_.jpg'],
  (select id from categories where slug = 'accessories' limit 1),
  (select id from brands where slug = 'logitech' limit 1),
  'Logitech MX Master 3S wireless mouse with ergonomic design and precision scrolling.',
  '{"Connectivity":"Bluetooth / USB-C","Sensor":"8000 DPI","Battery":"Up to 70 days","Buttons":"8 programmable","Compatibility":"Mac/Windows/Linux"}',
  true, false, null, 4.7, 1543
),
(
  'Anker PowerCore 26800', 'High-capacity portable charger.', 49.99,
  'https://m.media-amazon.com/images/I/61vJPLPsxxL._AC_SX679_.jpg',
  ARRAY['https://m.media-amazon.com/images/I/61vJPLPsxxL._AC_SX679_.jpg'],
  (select id from categories where slug = 'accessories' limit 1),
  (select id from brands where slug = 'anker' limit 1),
  'Anker PowerCore 26800 portable battery with 26800mAh capacity for multiple device charges.',
  '{"Capacity":"26800mAh","Output":"USB-C / USB-A","Fast Charging":"PowerIQ 3.0","Ports":"3 ports","Weight":"454g"}',
  true, false, null, 4.5, 3210
);

-- 18. Leads table for tracking customer inquiries and sales (updated for USD)
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone         text not null, -- Changed from whatsapp to generic phone
  address       text,
  email         text,
  product_id    uuid references products(id) on delete set null,
  product_name  text not null,
  category_id   uuid references categories(id) on delete set null, -- Changed to reference categories
  message       text,
  total_amount  numeric(10,2), -- Changed to decimal for USD
  currency      text not null default 'USD',
  payment_method_id uuid references payment_methods(id) on delete set null,
  order_path_id uuid references order_paths(id) on delete set null,
  source        text not null default 'checkout', -- checkout, product_page, homepage
  status        text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed', 'lost')),
  priority      text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  contacted_at  timestamptz
);

-- 19. Auto-update updated_at for leads
create trigger leads_updated_at
  before update on leads
  for each row execute function update_updated_at();

-- 20. Row Level Security for leads
alter table leads enable row level security;

create policy "Public can insert leads"
  on leads for insert to anon with check (true);

create policy "Authenticated can read leads"
  on leads for select to authenticated using (true);

create policy "Authenticated can update leads"
  on leads for update to authenticated using (true);

create policy "Authenticated can delete leads"
  on leads for delete to authenticated using (true);

-- 21. Indexes for better performance
create index idx_leads_status on leads(status);
create index idx_leads_created_at on leads(created_at desc);
create index idx_leads_product_id on leads(product_id);
create index idx_leads_source on leads(source);
create index idx_leads_priority on leads(priority);
