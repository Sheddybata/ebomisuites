import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken, getAdminCookieName, getAdminCookieMaxAge } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = body.password as string | undefined
    const expected = process.env.ADMIN_PASSWORD

    if (!expected) {
      return NextResponse.json(
        { error: 'Admin not configured' },
        { status: 500 }
      )
    }

    if (!password || password !== expected) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    const token = createAdminToken()
    const res = NextResponse.json({ success: true })
    res.cookies.set(getAdminCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: getAdminCookieMaxAge(),
      path: '/',
    })
    return res
  } catch (err) {
    console.error('Admin login error:', err)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
