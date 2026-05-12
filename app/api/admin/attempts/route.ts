import { NextResponse } from 'next/server'
import { getSupabaseService } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabaseService()
    const { data: attempts, error } = await supabase
      .from('attempts')
      .select('*, teachers(name)')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ attempts })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}