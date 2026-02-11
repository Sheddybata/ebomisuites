export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
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
          payment_method: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_ref: string
          check_in: string
          check_out: string
          nights: number
          room_type: string
          guests?: number
          name: string
          email: string
          phone: string
          special_requests?: string | null
          subtotal: number
          tax: number
          total: number
          payment_method?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_ref?: string
          check_in?: string
          check_out?: string
          nights?: number
          room_type?: string
          guests?: number
          name?: string
          email?: string
          phone?: string
          special_requests?: string | null
          subtotal?: number
          tax?: number
          total?: number
          payment_method?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
