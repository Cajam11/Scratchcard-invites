'use server'

import { NextResponse } from 'next/server'
import { comparePasswords, setAdminCookie, signAdminToken } from '@/lib/admin-auth'
import { getSupabaseService } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    const supabase = getSupabaseService()
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash')
      .eq('email', email)
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const passwordMatch = await comparePasswords(password, data.password_hash)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signAdminToken(data.email)
    await setAdminCookie(token)

    return NextResponse.json({ success: true, email: data.email })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
