import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'
import { getSupabaseService } from '@/lib/supabase'

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
    const adminPassword = request.headers.get('x-admin-password') || ''
    if (!process.env.ADMIN_PASSWORD || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const name = String(body.name || '').trim()
    const phrase = String(body.phrase || '').trim()
    const providedSlug = String(body.slug || '').trim()

    if (!name || !phrase) {
      return NextResponse.json({ error: 'missing name or phrase' }, { status: 400 })
    }

    const slug = providedSlug || slugify(name)
    const secret_hash = await bcrypt.hash(phrase, 10)
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    const inviteUrl = `${baseUrl}/invite/${slug}`
    const qrDataUrl = await QRCode.toDataURL(inviteUrl)

    const supabaseService = getSupabaseService()

    const { data, error } = await supabaseService
      .from('teachers')
      .insert({
        name,
        slug,
        secret_hash,
        notice_html: `<p>Vitajte na stužkovej pre <strong>${name}</strong>.</p>`,
      })
      .select('id, name, slug')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'db insert failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      name: data.name,
      slug: data.slug,
      inviteUrl,
      qrDataUrl,
    })
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
