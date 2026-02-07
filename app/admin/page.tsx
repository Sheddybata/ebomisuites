import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import { MOCK_BOOKINGS } from '@/lib/admin-mock-data'
import type { Booking } from '@/lib/types/booking'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const list = [...MOCK_BOOKINGS].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ) as Booking[]

  return (
    <div>
      <h1 className="font-serif text-2xl text-gray-900 mb-2">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Review and manage reservations.</p>
      <AdminDashboardClient bookings={list} />
    </div>
  )
}
