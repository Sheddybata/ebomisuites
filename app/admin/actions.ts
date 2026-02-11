'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getAdminCookieName } from '@/lib/admin-auth'
import { updateBookingStatus } from '@/lib/supabase-bookings'
import type { BookingStatus } from '@/lib/types/booking'

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

export async function updateBookingStatusAction(bookingId: string, status: BookingStatus) {
  const result = await updateBookingStatus(bookingId, status)
  if (!result.success) {
    return { error: result.error ?? 'Failed to update status' }
  }
  return { success: true }
}
