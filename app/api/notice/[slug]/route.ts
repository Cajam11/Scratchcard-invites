import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getSupabaseService } from '@/lib/supabase'

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params
    const auth = request.headers.get('authorization') || ''
    const match = auth.match(/^Bearer (.+)$/)
    if (!match) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const token = match[1]
    const payload: any = verifyToken(token)
    if (!payload || payload.slug !== params.slug) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const supabaseService = getSupabaseService()

    const { data, error } = await supabaseService
      .from('teachers')
      .select('id, name, notice_html, event_date, event_time, location')
      .eq('slug', params.slug)
      .limit(1)
      .single()

    if (error || !data) return NextResponse.json({ error: 'not found' }, { status: 404 })

    return NextResponse.json({ success: true, notice: data })
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
