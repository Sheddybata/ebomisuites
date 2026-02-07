export type BookingStatus =
  | 'pending_confirmation'
  | 'pending_payment'
  | 'confirmed'
  | 'paid'
  | 'cancelled'

export type PaymentMethod = 'manual' | 'paystack'

export interface Booking {
  id: string
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
  payment_method: PaymentMethod
  status: BookingStatus
  created_at: string
  updated_at: string
}

export interface BookingInsert {
  booking_ref: string
  check_in: string
  check_out: string
  nights: number
  room_type: string
  guests: number
  name: string
  email: string
  phone: string
  special_requests?: string | null
  subtotal: number
  tax: number
  total: number
  payment_method: PaymentMethod
  status: BookingStatus
}
