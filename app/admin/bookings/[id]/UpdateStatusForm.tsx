'use client'

import { useState } from 'react'
import type { BookingStatus } from '@/lib/types/booking'

const OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: 'pending_confirmation', label: 'Pending confirmation' },
  { value: 'pending_payment', label: 'Awaiting payment' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_STYLES: Record<string, string> = {
  pending_confirmation: 'bg-amber-100 text-amber-800 border-amber-200',
  pending_payment: 'bg-blue-100 text-blue-800 border-blue-200',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  paid: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function UpdateStatusForm({
  currentStatus,
}: {
  bookingId: string
  currentStatus: BookingStatus
}) {
  const [status, setStatus] = useState<BookingStatus>(currentStatus)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as BookingStatus)}
        className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-w-[200px]"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {OPTIONS.find((o) => o.value === status)?.label ?? status}
      </span>
      <p className="text-xs text-gray-500 w-full">Demo: status changes are not saved until you connect a database.</p>
    </div>
  )
}
