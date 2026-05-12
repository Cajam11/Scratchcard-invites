import { NextResponse } from 'next/server'
import { getSupabaseService } from '@/lib/supabase'
import { signToken } from '@/lib/auth'
import { normalizePhrase } from '@/lib/phrase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { slug, userInput } = body
    if (!slug || !userInput) return NextResponse.json({ error: 'missing' }, { status: 400 })

    const supabaseService = getSupabaseService()

    const { data, error } = await supabaseService
      .from('teachers')
      .select('id, hidden_word')
      .eq('slug', slug)
      .limit(1)
      .single()

    if (error || !data) return NextResponse.json({ error: 'not found' }, { status: 404 })

    if (!data.hidden_word) {
      return NextResponse.json({ error: 'Chýba nastavené skryté slovo pre tohto učiteľa. Kontaktujte študentov pre znovuvytvorenie pozvánky.' }, { status: 400 })
    }

    const expectedAnswer = normalizePhrase(data.hidden_word)
    const submittedAnswer = normalizePhrase(userInput)
    const success = expectedAnswer.length > 0 && expectedAnswer === submittedAnswer

    // Log the attempt
    await supabaseService.from('attempts').insert({
      teacher_id: data.id,
      user_input: userInput,
      success,
    })

    if (!success) return NextResponse.json({ success: false }, { status: 401 })

    const token = signToken({ teacherId: data.id, slug })
    return NextResponse.json({ success: true, token })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
