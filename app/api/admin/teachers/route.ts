import { NextResponse } from 'next/server'
import { getSupabaseService } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabaseService()
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ teachers })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}