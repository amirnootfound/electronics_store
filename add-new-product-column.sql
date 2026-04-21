-- Add new_product column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS new_product BOOLEAN NOT NULL DEFAULT false;
