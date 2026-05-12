import * as jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_SECRET: jwt.Secret = process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-prod'
const ADMIN_LOGIN_PATH = '/admin/login'
const ADMIN_DASHBOARD_PATH = '/admin/teachers'

function hasValidAdminToken(token?: string) {
  if (!token) {
    return false
  }

  try {
    const decoded = jwt.verify(token, ADMIN_SECRET)
    if (!decoded || typeof decoded === 'string') {
      return false
    }
    return decoded.type === 'admin' && typeof decoded.email === 'string'
  } catch {
    return false
  }
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const adminToken = request.cookies.get('admin_token')?.value
  const isAuthenticated = hasValidAdminToken(adminToken)

  const isAdminPage = pathname.startsWith('/admin')
  const isAdminLogin = pathname === ADMIN_LOGIN_PATH
  const isAdminApi = pathname.startsWith('/api/admin')
  const isAdminLoginApi = pathname === '/api/admin/auth/login'

  if (isAdminPage) {
    if (!isAuthenticated && !isAdminLogin) {
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url)
      loginUrl.searchParams.set('next', `${pathname}${search}`)
      return NextResponse.redirect(loginUrl)
    }

    if (isAuthenticated && isAdminLogin) {
      return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url))
    }
  }

  if (isAdminApi && !isAdminLoginApi && !isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
