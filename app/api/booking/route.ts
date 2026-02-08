import { NextRequest, NextResponse } from 'next/server'

// Room pricing (in Naira)
const ROOM_PRICES: Record<string, number> = {
  studio: 10000,
  executive: 12000,
  vip: 20000,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { checkIn, checkOut, roomType, guests, name, email, phone, specialRequests, paymentMethod } = body

    // Validate required fields
    if (!checkIn || !checkOut || !roomType || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate number of nights
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (nights <= 0) {
      return NextResponse.json(
        { error: 'Invalid date range' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const roomPrice = ROOM_PRICES[roomType] || ROOM_PRICES.studio
    const subtotal = roomPrice * nights
    const tax = subtotal * 0.05 // 5% tax
    const total = subtotal + tax

    // Generate booking reference
    const bookingRef = `EBOMI-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    const status = paymentMethod === 'paystack' ? 'pending_payment' : 'pending_confirmation'
    const guestsNum = typeof guests === 'number' ? guests : parseInt(String(guests), 10) || 1
    const now = new Date().toISOString()

    const bookingData = {
      id: `temp-${Date.now()}`,
      bookingRef,
      checkIn,
      checkOut,
      nights,
      roomType,
      guests: guestsNum,
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      specialRequests: specialRequests || null,
      subtotal,
      tax,
      total,
      paymentMethod: paymentMethod || 'manual',
      status,
      createdAt: now,
    }

    if (paymentMethod === 'paystack') {
      return NextResponse.json({
        success: true,
        booking: bookingData,
        requiresPayment: true,
      })
    }

    return NextResponse.json({
      success: true,
      booking: bookingData,
      message: 'Booking request received. Our team will contact you shortly.',
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    )
  }
}
