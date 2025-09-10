import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a dummy client if env vars are missing (for build time)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://dummy.supabase.co', 'dummy-key')

// Type definitions for our database
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  style_aesthetic: string | null
  category_id: string
  website_url: string | null
  brand_colors: string[] | null
  founded_year: number | null
  headquarters: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  brand_id: string
  category_id: string
  sku: string | null
  description: string | null
  price: number
  sale_price: number | null
  colors: string[] | null
  materials: string[] | null
  dimensions: Record<string, any> | null
  style_tags: string[] | null
  image_urls: string[] | null
  stock_quantity: number
  rating: number
  review_count: number
  created_at: string
  // Relations
  brand?: Brand
  category?: Category
}

// Database query functions
export const db = {
  // Categories
  getCategories: async () => {
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('dummy')) {
      console.warn('Supabase not configured, returning empty categories array')
      return []
    }
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data as Category[]
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },

  // Brands
  getBrands: async () => {
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('dummy')) {
      console.warn('Supabase not configured, returning empty brands array')
      return []
    }
    
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*, category:categories(*)')
        .order('name')
      
      if (error) throw error
      return data as (Brand & { category: Category })[]
    } catch (error) {
      console.error('Error fetching brands:', error)
      return []
    }
  },

  getBrandsByCategory: async (categorySlug: string) => {
    const { data, error } = await supabase
      .from('brands')
      .select('*, category:categories(*)')
      .eq('categories.slug', categorySlug)
      .order('name')
    
    if (error) throw error
    return data as (Brand & { category: Category })[]
  },

  // Products
  getProducts: async () => {
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('dummy')) {
      console.warn('Supabase not configured, returning empty products array')
      return []
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          category:categories(*)
        `)
        .eq('availability', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as (Product & { brand: Brand; category: Category })[]
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },

  getProductsByCategory: async (categorySlug: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        category:categories(*)
      `)
      .eq('categories.slug', categorySlug)
      .eq('availability', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as (Product & { brand: Brand; category: Category })[]
  },

  getProductsByBrand: async (brandSlug: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        category:categories(*)
      `)
      .eq('brands.slug', brandSlug)
      .eq('availability', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as (Product & { brand: Brand; category: Category })[]
  },

  getProductsByStyleTag: async (styleTag: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        category:categories(*)
      `)
      .contains('style_tags', [styleTag])
      .eq('availability', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as (Product & { brand: Brand; category: Category })[]
  },

  searchProducts: async (query: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        category:categories(*)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('availability', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as (Product & { brand: Brand; category: Category })[]
  }
}