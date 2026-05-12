import { NextResponse } from 'next/server'
import { getSupabaseService } from '@/lib/supabase'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const supabase = getSupabaseService()

    const { data, error } = await supabase
      .from('teachers')
      .select('name, phrase_sentence, hidden_word')
      .eq('slug', slug)
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Generate the template by replacing the hidden word with an underline
    const template = (data.phrase_sentence || '').replace(
      new RegExp(`(${data.hidden_word})`, 'i'),
      '_________'
    )

    return NextResponse.json({
      phrase_template: template,
      phrase_sentence: data.phrase_sentence,
      name: data.name,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
