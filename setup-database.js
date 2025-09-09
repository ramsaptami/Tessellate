const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://ancuwmmivgdvommzigwv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuY3V3bW1pdmdkdm9tbXppZ3d2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTg4MTgxNCwiZXhwIjoyMDY3NDU3ODE0fQ.xzLtxqa59hFhtdoYynv5OBa9VeeRhD2ba2-JnIhFMdA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Tessellate database with legacy keys enabled...')

    // Step 1: Create Categories
    console.log('📂 Creating categories table and data...')
    
    // First create the table structure (if not exists)
    await supabase.rpc('exec_sql', { 
      sql: `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        CREATE TABLE IF NOT EXISTS categories (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    })

    // Insert categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .upsert([
        { name: 'Clothing & Fashion', slug: 'clothing-fashion', description: 'Apparel, footwear, and fashion accessories' },
        { name: 'Furniture & Decor', slug: 'furniture-decor', description: 'Home furniture and decorative items' },
        { name: 'Home Accessories', slug: 'home-accessories', description: 'Small home items and functional accessories' },
        { name: 'Lighting', slug: 'lighting', description: 'Indoor and outdoor lighting solutions' },
        { name: 'Textiles & Rugs', slug: 'textiles-rugs', description: 'Rugs, curtains, and textile home goods' }
      ], { onConflict: 'slug' })
      .select()

    if (catError) {
      console.log('Category creation error:', catError.message)
    } else {
      console.log(`✅ Created/updated ${categories?.length || 0} categories`)
    }

    // Step 2: Create Brands table and data
    console.log('🏢 Creating brands table and data...')
    
    await supabase.rpc('exec_sql', { 
      sql: `
        CREATE TABLE IF NOT EXISTS brands (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          style_aesthetic VARCHAR(50),
          category_id UUID REFERENCES categories(id),
          website_url VARCHAR(255),
          logo_url VARCHAR(255),
          brand_colors JSON,
          founded_year INTEGER,
          headquarters VARCHAR(100),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_brands_category_id ON brands(category_id);
      `
    })

    // Get category IDs
    const { data: allCategories } = await supabase.from('categories').select('id, slug')
    const categoryMap = {}
    allCategories?.forEach(cat => {
      categoryMap[cat.slug] = cat.id
    })

    // Insert brands
    const { data: brands, error: brandError } = await supabase
      .from('brands')
      .upsert([
        {
          name: 'Nordica Style',
          slug: 'nordica-style',
          description: 'Scandinavian-inspired minimalist fashion',
          style_aesthetic: 'minimalist',
          category_id: categoryMap['clothing-fashion'],
          website_url: 'https://nordica-style.example.com',
          brand_colors: ['#2C3E50', '#ECF0F1', '#95A5A6'],
          founded_year: 2018,
          headquarters: 'Copenhagen, Denmark'
        },
        {
          name: 'Luxe Minimal',
          slug: 'luxe-minimal',
          description: 'High-end contemporary fashion with clean lines',
          style_aesthetic: 'luxury',
          category_id: categoryMap['clothing-fashion'],
          website_url: 'https://luxe-minimal.example.com',
          brand_colors: ['#1C1C1C', '#F8F8F8', '#D4AF37'],
          founded_year: 2015,
          headquarters: 'Milan, Italy'
        },
        {
          name: 'Urban Thread',
          slug: 'urban-thread',
          description: 'Street-inspired fashion with sustainable materials',
          style_aesthetic: 'contemporary',
          category_id: categoryMap['clothing-fashion'],
          website_url: 'https://urban-thread.example.com',
          brand_colors: ['#FF6B35', '#004E89', '#1A535C'],
          founded_year: 2019,
          headquarters: 'Brooklyn, NY'
        },
        {
          name: 'Nordic Living',
          slug: 'nordic-living',
          description: 'Functional furniture with Scandinavian design principles',
          style_aesthetic: 'scandinavian',
          category_id: categoryMap['furniture-decor'],
          website_url: 'https://nordic-living.example.com',
          brand_colors: ['#F7F3E9', '#8B4513', '#2F4F4F'],
          founded_year: 2012,
          headquarters: 'Stockholm, Sweden'
        },
        {
          name: 'Modern Craft',
          slug: 'modern-craft',
          description: 'Handcrafted furniture blending traditional and modern techniques',
          style_aesthetic: 'contemporary',
          category_id: categoryMap['furniture-decor'],
          website_url: 'https://modern-craft.example.com',
          brand_colors: ['#8B4513', '#F5DEB3', '#2F4F4F'],
          founded_year: 2016,
          headquarters: 'Portland, OR'
        },
        {
          name: 'Pure Home',
          slug: 'pure-home',
          description: 'Essential home accessories with timeless design',
          style_aesthetic: 'minimalist',
          category_id: categoryMap['home-accessories'],
          website_url: 'https://pure-home.example.com',
          brand_colors: ['#FFFFFF', '#F0F0F0', '#808080'],
          founded_year: 2014,
          headquarters: 'Tokyo, Japan'
        },
        {
          name: 'Artisan Collective',
          slug: 'artisan-collective',
          description: 'Handmade accessories from global artisans',
          style_aesthetic: 'bohemian',
          category_id: categoryMap['home-accessories'],
          website_url: 'https://artisan-collective.example.com',
          brand_colors: ['#CD853F', '#F4A460', '#8B4513'],
          founded_year: 2013,
          headquarters: 'Santa Fe, NM'
        }
      ], { onConflict: 'slug' })
      .select()

    if (brandError) {
      console.log('Brand creation error:', brandError.message)
    } else {
      console.log(`✅ Created/updated ${brands?.length || 0} brands`)
    }

    // Step 3: Create Products table and data
    console.log('🛍️ Creating products table and data...')
    
    await supabase.rpc('exec_sql', { 
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          brand_id UUID REFERENCES brands(id),
          category_id UUID REFERENCES categories(id),
          sku VARCHAR(50) UNIQUE,
          description TEXT,
          price DECIMAL(10,2),
          sale_price DECIMAL(10,2),
          currency VARCHAR(3) DEFAULT 'USD',
          colors JSON,
          materials JSON,
          dimensions JSON,
          style_tags JSON,
          image_urls JSON,
          availability BOOLEAN DEFAULT true,
          stock_quantity INTEGER DEFAULT 0,
          rating DECIMAL(2,1) DEFAULT 5.0,
          review_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
        CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
        CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability);
      `
    })

    // Get brand IDs
    const { data: allBrands } = await supabase.from('brands').select('id, slug')
    const brandMap = {}
    allBrands?.forEach(brand => {
      brandMap[brand.slug] = brand.id
    })

    // Insert products
    const { data: products, error: productError } = await supabase
      .from('products')
      .upsert([
        {
          name: 'Essential Cotton Tee',
          brand_id: brandMap['nordica-style'],
          category_id: categoryMap['clothing-fashion'],
          sku: 'NS-CT-001',
          description: 'Soft organic cotton t-shirt with perfect fit and feel',
          price: 45.00,
          sale_price: 38.25,
          colors: ['Pure White', 'Charcoal Grey', 'Navy Blue'],
          materials: ['100% Organic Cotton'],
          dimensions: { sizes: ['XS', 'S', 'M', 'L', 'XL'] },
          style_tags: ['minimalist', 'essential', 'organic'],
          image_urls: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'],
          stock_quantity: 150,
          rating: 4.8,
          review_count: 89
        },
        {
          name: 'Merino Wool Sweater',
          brand_id: brandMap['nordica-style'],
          category_id: categoryMap['clothing-fashion'],
          sku: 'NS-MW-002',
          description: 'Luxurious merino wool sweater perfect for layering',
          price: 125.00,
          sale_price: 100.00,
          colors: ['Oatmeal', 'Forest Green', 'Dusty Rose'],
          materials: ['100% Merino Wool'],
          dimensions: { sizes: ['S', 'M', 'L', 'XL'] },
          style_tags: ['minimalist', 'luxe', 'wool'],
          image_urls: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80'],
          stock_quantity: 75,
          rating: 4.9,
          review_count: 124
        },
        {
          name: 'Silk Blouse',
          brand_id: brandMap['luxe-minimal'],
          category_id: categoryMap['clothing-fashion'],
          sku: 'LM-SB-003',
          description: 'Elegant silk blouse with subtle draping and refined details',
          price: 185.00,
          colors: ['Ivory', 'Black', 'Champagne'],
          materials: ['100% Mulberry Silk'],
          dimensions: { sizes: ['XS', 'S', 'M', 'L'] },
          style_tags: ['luxury', 'elegant', 'silk'],
          image_urls: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80'],
          stock_quantity: 45,
          rating: 4.7,
          review_count: 67
        },
        {
          name: 'Birch Dining Table',
          brand_id: brandMap['nordic-living'],
          category_id: categoryMap['furniture-decor'],
          sku: 'NL-BDT-005',
          description: 'Solid birch dining table seats 6 people comfortably',
          price: 899.00,
          sale_price: 719.20,
          colors: ['Natural Birch', 'White Stain', 'Light Oak'],
          materials: ['Solid Birch Wood', 'Natural Oil Finish'],
          dimensions: { length: '180cm', width: '90cm', height: '75cm', weight: '45kg' },
          style_tags: ['scandinavian', 'minimalist', 'dining'],
          image_urls: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80'],
          stock_quantity: 12,
          rating: 4.8,
          review_count: 234
        },
        {
          name: 'Walnut Coffee Table',
          brand_id: brandMap['modern-craft'],
          category_id: categoryMap['furniture-decor'],
          sku: 'MC-WCT-007',
          description: 'Handcrafted walnut coffee table with hairpin legs',
          price: 675.00,
          sale_price: 540.00,
          colors: ['Natural Walnut', 'Ebony Stain'],
          materials: ['American Black Walnut', 'Steel Hairpin Legs'],
          dimensions: { length: '120cm', width: '60cm', height: '40cm', weight: '25kg' },
          style_tags: ['modern', 'handcrafted', 'industrial'],
          image_urls: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80'],
          stock_quantity: 8,
          rating: 4.7,
          review_count: 156
        },
        {
          name: 'Ceramic Vase Set',
          brand_id: brandMap['pure-home'],
          category_id: categoryMap['home-accessories'],
          sku: 'PH-CVS-009',
          description: 'Set of 3 minimalist ceramic vases in different heights',
          price: 78.00,
          colors: ['Matte White', 'Soft Grey', 'Warm Beige'],
          materials: ['High-fired Ceramic'],
          dimensions: { small: '8cm × 12cm', medium: '10cm × 18cm', large: '12cm × 24cm' },
          style_tags: ['minimalist', 'ceramic', 'modern'],
          image_urls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80'],
          stock_quantity: 67,
          rating: 4.8,
          review_count: 145
        },
        {
          name: 'Woven Storage Baskets',
          brand_id: brandMap['artisan-collective'],
          category_id: categoryMap['home-accessories'],
          sku: 'AC-WSB-010',
          description: 'Set of 3 handwoven seagrass baskets with leather handles',
          price: 89.00,
          sale_price: 71.20,
          colors: ['Natural', 'Two-tone Brown'],
          materials: ['Seagrass', 'Leather Handles'],
          dimensions: { small: '25cm × 20cm', medium: '30cm × 25cm', large: '35cm × 30cm' },
          style_tags: ['bohemian', 'handwoven', 'storage'],
          image_urls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'],
          stock_quantity: 34,
          rating: 4.7,
          review_count: 76
        }
      ], { onConflict: 'sku' })
      .select()

    if (productError) {
      console.log('Product creation error:', productError.message)
    } else {
      console.log(`✅ Created/updated ${products?.length || 0} products`)
    }

    // Step 4: Enable RLS and create policies
    console.log('🔒 Setting up Row Level Security...')
    await supabase.rpc('exec_sql', { 
      sql: `
        ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
        ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;

        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
        DROP POLICY IF EXISTS "Allow public read access on brands" ON brands;
        DROP POLICY IF EXISTS "Allow public read access on products" ON products;

        -- Create new policies
        CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
        CREATE POLICY "Allow public read access on brands" ON brands FOR SELECT USING (true);
        CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
      `
    })

    // Step 5: Final verification
    console.log('🔍 Verifying database setup...')
    
    const { data: finalCategories } = await supabase.from('categories').select('*')
    const { data: finalBrands } = await supabase.from('brands').select('*')
    const { data: finalProducts } = await supabase.from('products').select('*')

    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n📊 Final Summary:')
    console.log(`✅ Categories: ${finalCategories?.length || 0}`)
    console.log(`✅ Brands: ${finalBrands?.length || 0}`)
    console.log(`✅ Products: ${finalProducts?.length || 0}`)
    console.log('\n🏷️ Sample Categories: Clothing, Furniture, Home Accessories, Lighting, Textiles')
    console.log('🏢 Fictional Brands: Nordica Style, Luxe Minimal, Urban Thread, Nordic Living, etc.')
    console.log('🛍️ Products: T-shirts, sweaters, furniture, home accessories with full details')
    console.log('🔒 Row Level Security enabled with public read access')
    console.log('\n🚀 Your Tessellate database is ready for use!')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    console.error('Full error:', error)
  }
}

// Run the setup
setupDatabase()