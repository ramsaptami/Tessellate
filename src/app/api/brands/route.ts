import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: brands, error } = await supabaseAdmin
      .from('brands')
      .select('*, category:categories(*)')
      .order('name')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 })
    }

    return NextResponse.json({ brands })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}