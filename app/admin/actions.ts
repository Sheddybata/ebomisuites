'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getAdminCookieName } from '@/lib/admin-auth'

export async function logout() {
  const store = await cookies()
  store.set(getAdminCookieName(), '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  redirect('/admin/login')
}
