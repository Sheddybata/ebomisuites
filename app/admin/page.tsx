import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import { getBookings } from '@/lib/supabase-bookings'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const list = await getBookings()

  return (
    <div>
      <h1 className="font-serif text-2xl text-gray-900 mb-2">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Review and manage reservations.</p>
      <AdminDashboardClient bookings={list} />
    </div>
  )
}
