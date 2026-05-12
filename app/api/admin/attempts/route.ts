import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { getSupabaseService } from '@/lib/supabase'

export async function GET() {
  try {
    const adminSession = await verifyAdminSession()
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseService()
    const { data: attempts, error } = await supabase
      .from('attempts')
      .select('*, teachers(name)')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ attempts })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
