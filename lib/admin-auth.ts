import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-prod'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function comparePasswords(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function signAdminToken(email: string) {
  return jwt.sign({ email, type: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function getAdminToken() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_token')?.value || null
}

export async function clearAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}

export async function verifyAdminSession() {
  const token = await getAdminToken()
  if (!token) return null
  return verifyAdminToken(token)
}
