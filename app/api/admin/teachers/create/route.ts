import { getSupabaseService } from '@/lib/supabase'
import QRCode from 'qrcode'
import bcrypt from 'bcryptjs'
import { maskSentence } from '@/lib/phrase'

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      sentence,
      hidden_word,
      event_date,
      event_time,
      location,
    } = body

    if (!name || !sentence || !hidden_word) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    const slug = slugify(name)
    const password_hash = await bcrypt.hash(hidden_word, 10)
    const phrase_template = maskSentence(sentence, hidden_word)
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    const inviteUrl = `${baseUrl}/invite/${slug}`
    const qrDataUrl = await QRCode.toDataURL(inviteUrl)

    const supabase = getSupabaseService()
    const { data, error } = await supabase
      .from('teachers')
      .insert({
        name,
        slug,
        secret_hash: password_hash,
        phrase_template,
        phrase_sentence: sentence,
        hidden_word,
        notice_html: '',
        event_date,
        event_time,
        location,
      })
      .select('id, name, slug')
      .single()

    if (error || !data) {
      return new Response(JSON.stringify({ error: error?.message || 'Failed to create teacher' }), {
        status: 500,
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        teacher: data,
        inviteUrl,
        qrDataUrl,
      }),
      { status: 201 }
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}