export const ROOM_LABELS: Record<string, string> = {
  deluxe: 'Deluxe',
  executive: 'Executive',
  presidential: 'Presidential',
}

export const STATUS_LABELS: Record<string, string> = {
  pending_confirmation: 'Pending',
  pending_payment: 'Awaiting payment',
  confirmed: 'Confirmed',
  paid: 'Paid',
  cancelled: 'Cancelled',
}

export const STATUS_STYLES: Record<string, string> = {
  pending_confirmation: 'bg-amber-100 text-amber-800 border-amber-200',
  pending_payment: 'bg-blue-100 text-blue-800 border-blue-200',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  paid: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
}

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending_confirmation', label: 'Pending' },
  { value: 'pending_payment', label: 'Awaiting payment' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
] as const

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateForExport(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
