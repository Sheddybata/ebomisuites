import type { Booking } from '@/lib/types/booking'
import { ROOM_LABELS, STATUS_LABELS, formatDateForExport } from '@/lib/admin-constants'

export function bookingsToCSV(bookings: Booking[]): string {
  const headers = [
    'Reference',
    'Guest',
    'Email',
    'Phone',
    'Room',
    'Guests',
    'Check-in',
    'Check-out',
    'Nights',
    'Status',
    'Payment',
    'Subtotal (₦)',
    'Tax (₦)',
    'Total (₦)',
    'Special requests',
    'Created',
  ]
  const rows = bookings.map((b) => [
    b.booking_ref,
    b.name,
    b.email,
    b.phone,
    ROOM_LABELS[b.room_type] ?? b.room_type,
    String(b.guests),
    formatDateForExport(b.check_in),
    formatDateForExport(b.check_out),
    String(b.nights),
    STATUS_LABELS[b.status] ?? b.status,
    b.payment_method,
    String(b.subtotal),
    String(b.tax),
    String(b.total),
    b.special_requests ?? '',
    formatDateForExport(b.created_at),
  ])
  const escape = (cell: string) => {
    const s = String(cell)
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  return [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\r\n')
}

export function downloadCSV(bookings: Booking[], filename?: string) {
  const csv = bookingsToCSV(bookings)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename ?? `ebomi-bookings-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export async function downloadExcel(bookings: Booking[]) {
  const XLSX = await import('xlsx')
  const rows = bookings.map((b) => ({
    Reference: b.booking_ref,
    Guest: b.name,
    Email: b.email,
    Phone: b.phone,
    Room: ROOM_LABELS[b.room_type] ?? b.room_type,
    Guests: b.guests,
    'Check-in': formatDateForExport(b.check_in),
    'Check-out': formatDateForExport(b.check_out),
    Nights: b.nights,
    Status: STATUS_LABELS[b.status] ?? b.status,
    Payment: b.payment_method,
    'Subtotal (₦)': b.subtotal,
    'Tax (₦)': b.tax,
    'Total (₦)': b.total,
    'Special requests': b.special_requests ?? '',
    Created: formatDateForExport(b.created_at),
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Bookings')
  const colWidths = [{ wch: 22 }, { wch: 18 }, { wch: 24 }, { wch: 16 }, { wch: 12 }, { wch: 6 }, { wch: 10 }, { wch: 10 }, { wch: 6 }, { wch: 18 }, { wch: 8 }, { wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 30 }, { wch: 10 }]
  ws['!cols'] = colWidths
  XLSX.writeFile(wb, `ebomi-bookings-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

export async function downloadPDF(bookings: Booking[]) {
  const { jsPDF } = await import('jspdf')
  const autoTable = (await import('jspdf-autotable')).default
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  doc.setFontSize(18)
  doc.text('EBOMI Suites & Towers — Bookings Report', 14, 16)
  doc.setFontSize(10)
  doc.text(`Generated ${new Date().toLocaleDateString('en-NG', { dateStyle: 'medium' })} · ${bookings.length} booking(s)`, 14, 22)
  const tableData = bookings.map((b) => [
    b.booking_ref,
    b.name,
    ROOM_LABELS[b.room_type] ?? b.room_type,
    formatDateForExport(b.check_in),
    formatDateForExport(b.check_out),
    String(b.nights),
    STATUS_LABELS[b.status] ?? b.status,
    `₦${Number(b.total).toLocaleString()}`,
  ])
  autoTable(doc, {
    startY: 28,
    head: [['Reference', 'Guest', 'Room', 'Check-in', 'Check-out', 'Nights', 'Status', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [163, 0, 13], textColor: 255 },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 35 },
      2: { cellWidth: 22 },
      3: { cellWidth: 22 },
      4: { cellWidth: 22 },
      5: { cellWidth: 12 },
      6: { cellWidth: 28 },
      7: { cellWidth: 25 },
    },
  })
  doc.save(`ebomi-bookings-${new Date().toISOString().slice(0, 10)}.pdf`)
}
