const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ancuwmmivgdvommzigwv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuY3V3bW1pdmdkdm9tbXppZ3d2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTg4MTgxNCwiZXhwIjoyMDY3NDU3ODE0fQ.xzLtxqa59hFhtdoYynv5OBa9VeeRhD2ba2-JnIhFMdA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createData() {
  console.log('🚀 Creating Tessellate database data...')
  console.log('⚠️  Note: Tables should be created manually via Supabase SQL Editor first')
  
  try {
    // Step 1: Insert Categories
    console.log('📂 Inserting categories...')
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .upsert([
        { name: 'Clothing & Fashion', slug: 'clothing-fashion', description: 'Apparel, footwear, and fashion accessories' },
        { name: 'Furniture & Decor', slug: 'furniture-decor', description: 'Home furniture and decorative items' },
        { name: 'Home Accessories', slug: 'home-accessories', description: 'Small home items and functional accessories' },
        { name: 'Lighting', slug: 'lighting', description: 'Indoor and outdoor lighting solutions' },
        { name: 'Textiles & Rugs', slug: 'textiles-rugs', description: 'Rugs, curtains, and textile home goods' }
      ], { onConflict: 'slug', ignoreDuplicates: false })
      .select()

    if (catError) {
      console.log('❌ Category error:', catError.message)
      console.log('💡 You may need to create the tables manually first in Supabase SQL Editor')
      return
    }
    console.log(`✅ Categories: ${categories?.length || 0}`)

    // Get category IDs
    const { data: allCategories } = await supabase.from('categories').select('id, slug')
    const categoryMap = {}
    allCategories?.forEach(cat => {
      categoryMap[cat.slug] = cat.id
    })

    // Step 2: Insert Brands
    console.log('🏢 Inserting brands...')
    const brandsToInsert = [
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
        name: 'Pure Home',
        slug: 'pure-home',
        description: 'Essential home accessories with timeless design',
        style_aesthetic: 'minimalist',
        category_id: categoryMap['home-accessories'],
        website_url: 'https://pure-home.example.com',
        brand_colors: ['#FFFFFF', '#F0F0F0', '#808080'],
        founded_year: 2014,
        headquarters: 'Tokyo, Japan'
      }
    ]

    const { data: brands, error: brandError } = await supabase
      .from('brands')
      .upsert(brandsToInsert, { onConflict: 'slug', ignoreDuplicates: false })
      .select()

    if (brandError) {
      console.log('❌ Brand error:', brandError.message)
      return
    }
    console.log(`✅ Brands: ${brands?.length || 0}`)

    // Get brand IDs
    const { data: allBrands } = await supabase.from('brands').select('id, slug')
    const brandMap = {}
    allBrands?.forEach(brand => {
      brandMap[brand.slug] = brand.id
    })

    // Step 3: Insert Products
    console.log('🛍️ Inserting products...')
    const productsToInsert = [
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
        name: 'Silk Blouse',
        brand_id: brandMap['luxe-minimal'],
        category_id: categoryMap['clothing-fashion'],
        sku: 'LM-SB-003',
        description: 'Elegant silk blouse with subtle draping',
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
      }
    ]

    const { data: products, error: productError } = await supabase
      .from('products')
      .upsert(productsToInsert, { onConflict: 'sku', ignoreDuplicates: false })
      .select()

    if (productError) {
      console.log('❌ Product error:', productError.message)
      return
    }
    console.log(`✅ Products: ${products?.length || 0}`)

    // Verification
    const { data: finalCategories } = await supabase.from('categories').select('count')
    const { data: finalBrands } = await supabase.from('brands').select('count')
    const { data: finalProducts } = await supabase.from('products').select('count')

    console.log('\n🎉 Database populated successfully!')
    console.log('\n📊 Summary:')
    console.log(`✅ Categories: ${categories?.length}`)
    console.log(`✅ Brands: ${brands?.length}`)
    console.log(`✅ Products: ${products?.length}`)
    console.log('\n🔗 Your database is ready! Try querying it from your app.')

  } catch (error) {
    console.error('❌ Failed:', error.message)
    console.log('\n💡 Make sure to:')
    console.log('1. Create tables manually in Supabase SQL Editor first')
    console.log('2. Enable Row Level Security with public read policies')
  }
}

createData()