# 🚀 Quick Supabase Database Setup (5 minutes)

## Step 1: Go to Supabase SQL Editor
1. Open https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in sidebar
4. Click **"New Query"**

## Step 2: Copy & Run These 3 Queries

### Query 1: Create Tables
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE brands (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  style_aesthetic VARCHAR(50),
  category_id UUID REFERENCES categories(id),
  website_url VARCHAR(255),
  brand_colors JSON,
  founded_year INTEGER,
  headquarters VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  brand_id UUID REFERENCES brands(id),
  category_id UUID REFERENCES categories(id),
  sku VARCHAR(50) UNIQUE,
  description TEXT,
  price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  colors JSON,
  materials JSON,
  dimensions JSON,
  style_tags JSON,
  image_urls JSON,
  stock_quantity INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
```

### Query 2: Insert Sample Data
```sql
INSERT INTO categories (name, slug, description) VALUES
('Clothing & Fashion', 'clothing-fashion', 'Apparel and fashion accessories'),
('Furniture & Decor', 'furniture-decor', 'Home furniture and decorative items'),
('Home Accessories', 'home-accessories', 'Small home items and accessories');

INSERT INTO brands (name, slug, description, style_aesthetic, category_id, brand_colors, founded_year, headquarters) VALUES
('Nordica Style', 'nordica-style', 'Scandinavian minimalist fashion', 'minimalist', 
 (SELECT id FROM categories WHERE slug = 'clothing-fashion'), 
 '["#2C3E50", "#ECF0F1"]', 2018, 'Copenhagen'),
 
('Nordic Living', 'nordic-living', 'Functional Scandinavian furniture', 'scandinavian', 
 (SELECT id FROM categories WHERE slug = 'furniture-decor'), 
 '["#F7F3E9", "#8B4513"]', 2012, 'Stockholm'),
 
('Pure Home', 'pure-home', 'Essential home accessories', 'minimalist', 
 (SELECT id FROM categories WHERE slug = 'home-accessories'), 
 '["#FFFFFF", "#808080"]', 2014, 'Tokyo');

INSERT INTO products (name, brand_id, category_id, sku, description, price, colors, materials, style_tags, image_urls, stock_quantity, rating) VALUES
('Cotton Tee', 
 (SELECT id FROM brands WHERE slug = 'nordica-style'),
 (SELECT id FROM categories WHERE slug = 'clothing-fashion'),
 'NS-CT-001', 'Organic cotton t-shirt', 45.00,
 '["White", "Grey", "Navy"]', '["100% Organic Cotton"]', '["minimalist", "organic"]',
 '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"]', 150, 4.8),

('Birch Table', 
 (SELECT id FROM brands WHERE slug = 'nordic-living'),
 (SELECT id FROM categories WHERE slug = 'furniture-decor'),
 'NL-BT-005', 'Solid birch dining table', 899.00,
 '["Natural Birch", "White Stain"]', '["Solid Birch Wood"]', '["scandinavian", "dining"]',
 '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"]', 12, 4.8),

('Ceramic Vase Set', 
 (SELECT id FROM brands WHERE slug = 'pure-home'),
 (SELECT id FROM categories WHERE slug = 'home-accessories'),
 'PH-CVS-009', 'Set of 3 minimalist vases', 78.00,
 '["White", "Grey", "Beige"]', '["Ceramic"]', '["minimalist", "modern"]',
 '["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"]', 67, 4.8);
```

### Query 3: Verify Setup
```sql
SELECT 'Categories' as table_name, count(*) as count FROM categories
UNION ALL
SELECT 'Brands' as table_name, count(*) as count FROM brands
UNION ALL  
SELECT 'Products' as table_name, count(*) as count FROM products;
```

## ✅ Expected Result
- Categories: 3
- Brands: 3  
- Products: 3

## 🎯 You're Done!
Your database now has fictional brands and products ready for your Tessellate app!