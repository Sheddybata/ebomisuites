import { getSupabaseAdmin } from './supabase'
import type { Booking } from './types/booking'
import type { BookingStatus } from './types/booking'

function rowToBooking(row: Record<string, unknown>): Booking {
  return {
    id: String(row.id),
    booking_ref: String(row.booking_ref),
    check_in: String(row.check_in),
    check_out: String(row.check_out),
    nights: Number(row.nights),
    room_type: String(row.room_type),
    guests: Number(row.guests),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    special_requests: row.special_requests != null ? String(row.special_requests) : null,
    subtotal: Number(row.subtotal),
    tax: Number(row.tax),
    total: Number(row.total),
    payment_method: String(row.payment_method) as 'manual' | 'paystack',
    status: String(row.status) as BookingStatus,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }
}

export async function getBookings(): Promise<Booking[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase getBookings error:', error)
    return []
  }

  return (data ?? []).map((row) => rowToBooking(row as Record<string, unknown>))
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return rowToBooking(data as Record<string, unknown>)
}

export interface InsertBookingInput {
  booking_ref: string
  check_in: string
  check_out: string
  nights: number
  room_type: string
  guests: number
  name: string
  email: string
  phone: string
  special_requests: string | null
  subtotal: number
  tax: number
  total: number
  payment_method: 'manual' | 'paystack'
  status: BookingStatus
}

export async function insertBooking(input: InsertBookingInput): Promise<{ id: string } | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      booking_ref: input.booking_ref,
      check_in: input.check_in,
      check_out: input.check_out,
      nights: input.nights,
      room_type: input.room_type,
      guests: input.guests,
      name: input.name,
      email: input.email,
      phone: input.phone,
      special_requests: input.special_requests,
      subtotal: input.subtotal,
      tax: input.tax,
      total: input.total,
      payment_method: input.payment_method,
      status: input.status,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase insertBooking error:', error)
    return null
  }

  return data ? { id: String(data.id) } : null
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { success: false, error: 'Supabase not configured' }

  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Supabase updateBookingStatus error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateBookingStatusByRef(
  bookingRef: string,
  status: BookingStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return { success: false, error: 'Supabase not configured' }

  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('booking_ref', bookingRef)

  if (error) {
    console.error('Supabase updateBookingStatusByRef error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
