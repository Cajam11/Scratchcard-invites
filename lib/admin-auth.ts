import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-prod'
const ADMIN_COOKIE_NAME = 'admin_token'
const ADMIN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days

export type AdminSession = {
  email: string
  type: 'admin'
  iat?: number
  exp?: number
}

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
    const decoded = jwt.verify(token, JWT_SECRET)
    if (!decoded || typeof decoded === 'string') {
      return null
    }
    if (decoded.type !== 'admin' || typeof decoded.email !== 'string') {
      return null
    }
    return decoded as AdminSession
  } catch {
    return null
  }
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  })
}

export async function getAdminToken() {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value || null
}

export async function clearAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export async function verifyAdminSession() {
  const token = await getAdminToken()
  if (!token) return null
  return verifyAdminToken(token)
}
