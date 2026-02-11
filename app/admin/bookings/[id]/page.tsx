import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getAdminSession } from '@/lib/admin-auth'
import { getBookingById } from '@/lib/supabase-bookings'
import { ROOM_LABELS, STATUS_LABELS, STATUS_STYLES, formatDate } from '@/lib/admin-constants'
import UpdateStatusForm from './UpdateStatusForm'

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const { id } = await params
  const b = await getBookingById(id)
  if (!b) notFound()

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary transition-colors mb-6"
      >
        ← Back to bookings
      </Link>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-xl text-gray-900 font-semibold">{b.booking_ref}</h1>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${STATUS_STYLES[b.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {STATUS_LABELS[b.status] ?? b.status}
          </span>
        </div>
        <div className="px-6 py-5 space-y-6">
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Guest</h2>
            <p className="font-medium text-gray-900">{b.name}</p>
            <p className="text-sm text-gray-600 mt-0.5">
              <a href={`mailto:${b.email}`} className="text-primary hover:underline">{b.email}</a>
            </p>
            <p className="text-sm text-gray-600">
              <a href={`tel:${b.phone}`} className="text-primary hover:underline">{b.phone}</a>
            </p>
          </section>
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Stay</h2>
            <p className="text-gray-900">{ROOM_LABELS[b.room_type] ?? b.room_type} · {b.guests} guest{b.guests !== 1 ? 's' : ''}</p>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(b.check_in)} → {formatDate(b.check_out)} · {b.nights} night{b.nights !== 1 ? 's' : ''}
            </p>
          </section>
          {b.special_requests && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Special requests</h2>
              <p className="text-gray-700 bg-gray-50 rounded-lg px-4 py-3 text-sm">{b.special_requests}</p>
            </section>
          )}
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment & amount</h2>
            <p className="text-sm text-gray-700 capitalize">{b.payment_method}</p>
            <p className="text-sm text-gray-600 mt-1">
              Subtotal ₦{Number(b.subtotal).toLocaleString()} + Tax ₦{Number(b.tax).toLocaleString()}
            </p>
            <p className="text-lg font-semibold text-gray-900 mt-1">₦{Number(b.total).toLocaleString()}</p>
          </section>
          <p className="text-xs text-gray-400">Created {formatDate(b.created_at)}</p>
        </div>
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Update status</h2>
          <UpdateStatusForm bookingId={b.id} currentStatus={b.status} />
        </div>
      </div>
    </div>
  )
}
