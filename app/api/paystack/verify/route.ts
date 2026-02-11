import { NextRequest, NextResponse } from 'next/server'
import { updateBookingStatusByRef } from '@/lib/supabase-bookings'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      )
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecretKey) {
      return NextResponse.json(
        { error: 'Paystack configuration error' },
        { status: 500 }
      )
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
      },
    })

    const data = await response.json()

    if (!response.ok || !data.status) {
      return NextResponse.json(
        { error: data.message || 'Failed to verify payment' },
        { status: response.status }
      )
    }

    const bookingRef = data.data.metadata?.custom_fields?.find((f: { variable_name: string }) => f.variable_name === 'booking_ref')?.value

    // On successful payment, update booking status to 'paid' in Supabase
    if (data.data.status === 'success' && bookingRef) {
      await updateBookingStatusByRef(bookingRef, 'paid')
    }

    return NextResponse.json({
      success: data.data.status === 'success',
      transaction: data.data,
      bookingRef,
    })
  } catch (error) {
    console.error('Paystack verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
