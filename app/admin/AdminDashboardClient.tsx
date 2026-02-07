'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  Banknote,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import type { Booking } from '@/lib/types/booking'
import { ROOM_LABELS, STATUS_LABELS, STATUS_STYLES, STATUS_OPTIONS, formatDate } from '@/lib/admin-constants'
import { downloadCSV, downloadExcel, downloadPDF } from './export-utils'

type SortKey = 'booking_ref' | 'created_at' | 'check_in' | 'total' | 'name' | 'status'
type SortDir = 'asc' | 'desc'

export default function AdminDashboardClient({ bookings }: { bookings: Booking[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null)

  const filtered = useMemo(() => {
    let list = bookings
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.booking_ref.toLowerCase().includes(q) ||
          (b.phone && b.phone.includes(q))
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter((b) => b.status === statusFilter)
    }
    return list
  }, [bookings, search, statusFilter])

  const sorted = useMemo(() => {
    const list = [...filtered]
    list.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'booking_ref':
          cmp = a.booking_ref.localeCompare(b.booking_ref)
          break
        case 'created_at':
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'check_in':
          cmp = new Date(a.check_in).getTime() - new Date(b.check_in).getTime()
          break
        case 'total':
          cmp = a.total - b.total
          break
        case 'name':
          cmp = a.name.localeCompare(b.name)
          break
        case 'status':
          cmp = a.status.localeCompare(b.status)
          break
        default:
          cmp = 0
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [filtered, sortKey, sortDir])

  const kpis = useMemo(() => {
    const total = filtered.length
    const pending = filtered.filter(
      (b) => b.status === 'pending_confirmation' || b.status === 'pending_payment'
    ).length
    const confirmedOrPaid = filtered.filter(
      (b) => b.status === 'confirmed' || b.status === 'paid'
    ).length
    const revenue = filtered
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + Number(b.total), 0)
    return { total, pending, confirmedOrPaid, revenue }
  }, [filtered])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir(key === 'name' || key === 'status' ? 'asc' : 'desc')
    }
  }

  const SortIcon = ({ column }: { column: SortKey }) =>
    sortKey === column ? (
      sortDir === 'asc' ? (
        <ChevronUp className="w-3.5 h-3.5 inline ml-0.5 opacity-70" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5 inline ml-0.5 opacity-70" />
      )
    ) : null

  const handleExportExcel = async () => {
    setExporting('excel')
    try {
      await downloadExcel(sorted)
    } finally {
      setExporting(null)
    }
  }

  const handleExportPDF = async () => {
    setExporting('pdf')
    try {
      await downloadPDF(sorted)
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total bookings</p>
              <p className="text-xl font-semibold text-gray-900">{kpis.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Needs action</p>
              <p className="text-xl font-semibold text-gray-900">{kpis.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Confirmed / Paid</p>
              <p className="text-xl font-semibold text-gray-900">{kpis.confirmedOrPaid}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue (filtered)</p>
              <p className="text-xl font-semibold text-gray-900">
                ₦{kpis.revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar: title, search, filter, export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search by name, email, reference…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none bg-no-repeat bg-[length:12px] bg-[right_12px_center]"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")' }}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 mr-1">Export</span>
          <button
            onClick={() => downloadCSV(sorted)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={handleExportExcel}
            disabled={!!exporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {exporting === 'excel' ? '…' : 'Excel'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={!!exporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {exporting === 'pdf' ? '…' : 'PDF'}
          </button>
        </div>
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="font-serif text-lg text-gray-900 mb-1">No bookings match</h2>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            Try changing the search or filter to see more results.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="px-5 py-3.5">
                    <button
                      onClick={() => toggleSort('booking_ref')}
                      className="text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 flex items-center"
                    >
                      Reference <SortIcon column="booking_ref" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5">
                    <button
                      onClick={() => toggleSort('name')}
                      className="text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 flex items-center"
                    >
                      Guest <SortIcon column="name" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-5 py-3.5">
                    <button
                      onClick={() => toggleSort('check_in')}
                      className="text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 flex items-center"
                    >
                      Check-in <SortIcon column="check_in" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5">
                    <button
                      onClick={() => toggleSort('status')}
                      className="text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 flex items-center"
                    >
                      Status <SortIcon column="status" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5">
                    <button
                      onClick={() => toggleSort('total')}
                      className="text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 flex items-center"
                    >
                      Total <SortIcon column="total" />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-medium text-gray-900">{b.booking_ref}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-900">{b.name}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {ROOM_LABELS[b.room_type] ?? b.room_type}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{formatDate(b.check_in)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${STATUS_STYLES[b.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}
                      >
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      ₦{Number(b.total).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 text-sm text-gray-500">
            Showing {sorted.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            {(search || statusFilter !== 'all') && ' (filtered)'}
          </div>
        </div>
      )}
    </div>
  )
}
