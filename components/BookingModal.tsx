"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Users, ArrowRight, Loader2, CreditCard, Wallet } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useToast } from "@/contexts/ToastContext"
import { isPaystackEnabled } from "@/lib/site-config"
import { cn } from "@/lib/utils"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

// Room pricing (in Naira)
const ROOM_PRICES: Record<string, number> = {
  studio: 10000,
  executive: 12000,
  vip: 20000,
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { t } = useLanguage()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2",
    roomType: "",
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
    paymentMethod: "manual", // "manual" or "paystack"
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calculate booking amount
  const bookingAmount = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut || !formData.roomType) {
      return { nights: 0, subtotal: 0, tax: 0, total: 0 }
    }

    const checkInDate = new Date(formData.checkIn)
    const checkOutDate = new Date(formData.checkOut)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (nights <= 0) {
      return { nights: 0, subtotal: 0, tax: 0, total: 0 }
    }

    const roomPrice = ROOM_PRICES[formData.roomType] || 0
    const subtotal = roomPrice * nights
    const tax = subtotal * 0.05 // 5% tax
    const total = subtotal + tax

    return { nights, subtotal, tax, total }
  }, [formData.checkIn, formData.checkOut, formData.roomType])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.checkIn) {
      newErrors.checkIn = t("booking.validation.checkInRequired")
    } else if (new Date(formData.checkIn) < new Date()) {
      newErrors.checkIn = t("booking.validation.checkInFuture")
    }

    if (!formData.checkOut) {
      newErrors.checkOut = t("booking.validation.checkOutRequired")
    } else if (formData.checkIn && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      newErrors.checkOut = t("booking.validation.checkOutAfter")
    }

    if (!formData.name.trim()) {
      newErrors.name = t("booking.validation.nameRequired")
    }

    if (!formData.email.trim()) {
      newErrors.email = t("booking.validation.emailRequired")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("booking.validation.emailInvalid")
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("booking.validation.phoneRequired")
    }

    if (!formData.roomType) {
      newErrors.roomType = t("booking.validation.roomTypeRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showToast(t("booking.validation.formErrors"), "error")
      return
    }

    // Pay Online selected but Paystack not configured yet — ask to use Pay on Arrival
    if (formData.paymentMethod === 'paystack' && !isPaystackEnabled()) {
      showToast(t("booking.form.paymentPaystackUnavailable"), "error")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Submit booking to backend
      const bookingResponse = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentMethod: formData.paymentMethod,
        }),
      })

      const bookingData = await bookingResponse.json()

      if (!bookingResponse.ok) {
        throw new Error(bookingData.error || 'Failed to process booking')
      }

      // If payment is via Paystack, initialize payment
      if (formData.paymentMethod === 'paystack' && bookingData.requiresPayment) {
        const paymentResponse = await fetch('/api/paystack/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            amount: bookingData.booking.total,
            bookingRef: bookingData.booking.bookingRef,
            metadata: [
              {
                display_name: 'Check-in',
                variable_name: 'check_in',
                value: formData.checkIn,
              },
              {
                display_name: 'Check-out',
                variable_name: 'check_out',
                value: formData.checkOut,
              },
              {
                display_name: 'Room Type',
                variable_name: 'room_type',
                value: formData.roomType,
              },
            ],
          }),
        })

        const paymentData = await paymentResponse.json()

        if (!paymentResponse.ok || !paymentData.success) {
          throw new Error(paymentData.error || 'Failed to initialize payment')
        }

        // Redirect to Paystack payment page
        window.location.href = paymentData.authorizationUrl
        return
      }

      // For manual payment, show success message
      showToast(t("booking.form.success"), "success")
      
      // Reset form
      setFormData({
        checkIn: "",
        checkOut: "",
        guests: "2",
        roomType: "",
        name: "",
        email: "",
        phone: "",
        specialRequests: "",
        paymentMethod: "manual",
      })
      setErrors({})
      
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error: any) {
      showToast(error.message || "An error occurred. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 relative">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b-2 border-secondary/30 px-6 py-5 flex items-center justify-between shadow-sm">
                <div>
                  <h2 className="text-2xl font-serif text-gray-900">{t("booking.form.title")}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Reserve your luxury experience</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-gray-600 hover:text-primary"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                {/* Dates & Guests */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-secondary" aria-hidden="true" />
                      {t("booking.form.checkIn")}
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className={cn(
                        "w-full px-4 py-3 border-2 rounded-lg transition-all",
                        "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        "placeholder:text-gray-400",
                        errors.checkIn 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                          : "border-gray-300 hover:border-gray-400"
                      )}
                    />
                    {errors.checkIn && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.checkIn}</p>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-secondary" aria-hidden="true" />
                      {t("booking.form.checkOut")}
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      required
                      min={formData.checkIn || new Date().toISOString().split("T")[0]}
                      className={cn(
                        "w-full px-4 py-3 border-2 rounded-lg transition-all",
                        "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        "placeholder:text-gray-400",
                        errors.checkOut 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                          : "border-gray-300 hover:border-gray-400"
                      )}
                    />
                    {errors.checkOut && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.checkOut}</p>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-secondary" aria-hidden="true" />
                      {t("booking.form.guests")}
                    </label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-gray-400 appearance-none bg-white cursor-pointer"
                      aria-label={t("booking.form.guests")}
                    >
                      <option value="1">1 {t("booking.form.guests")}</option>
                      <option value="2">2 {t("booking.form.guests")}</option>
                      <option value="3">3 {t("booking.form.guests")}</option>
                      <option value="4">4 {t("booking.form.guests")}</option>
                      <option value="5+">5+ {t("booking.form.guests")}</option>
                    </select>
                  </div>
                </div>

                {/* Room Type */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {t("booking.form.roomType")}
                  </label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    required
                    className={cn(
                      "w-full px-4 py-3 border-2 rounded-lg transition-all appearance-none bg-white cursor-pointer",
                      "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      errors.roomType 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                        : "border-gray-300 hover:border-gray-400"
                    )}
                    aria-label={t("booking.form.roomType")}
                  >
                    <option value="">{t("booking.form.selectRoom")}</option>
                    <option value="studio">{t("room.studio.title")}</option>
                    <option value="executive">{t("room.executive.title")}</option>
                    <option value="vip">{t("room.vip.title")}</option>
                  </select>
                  {errors.roomType && (
                    <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.roomType}</p>
                  )}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("booking.form.name")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={cn(
                        "w-full px-4 py-3 border-2 rounded-lg transition-all",
                        "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        "placeholder:text-gray-400",
                        errors.name 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                          : "border-gray-300 hover:border-gray-400"
                      )}
                      aria-label={t("booking.form.name")}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.name}</p>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("booking.form.email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={cn(
                        "w-full px-4 py-3 border-2 rounded-lg transition-all",
                        "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        "placeholder:text-gray-400",
                        errors.email 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                          : "border-gray-300 hover:border-gray-400"
                      )}
                      aria-label={t("booking.form.email")}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {t("booking.form.phone")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={cn(
                      "w-full px-4 py-3 border-2 rounded-lg transition-all",
                      "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      "placeholder:text-gray-400",
                      errors.phone 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                        : "border-gray-300 hover:border-gray-400"
                    )}
                    aria-label={t("booking.form.phone")}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.phone}</p>
                  )}
                </div>

                {/* Special Requests */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {t("booking.form.specialRequests")}
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-gray-400 resize-none placeholder:text-gray-400"
                    placeholder={t("booking.form.specialRequests")}
                    aria-label={t("booking.form.specialRequests")}
                  />
                </div>

                {/* Payment Method — always show both options until Paystack is configured */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    {t("booking.form.paymentMethod")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "manual" })}
                      className={cn(
                        "p-4 border-2 rounded-lg transition-all text-left",
                        "flex items-center gap-3",
                        formData.paymentMethod === "manual"
                          ? "border-primary bg-primary/5"
                          : "border-gray-300 hover:border-gray-400"
                      )}
                    >
                      <Wallet className={cn("w-5 h-5", formData.paymentMethod === "manual" ? "text-primary" : "text-gray-400")} />
                      <div>
                        <div className="font-medium text-gray-900">{t("booking.form.paymentManual")}</div>
                        <div className="text-xs text-gray-500">Pay when you arrive</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "paystack" })}
                      className={cn(
                        "p-4 border-2 rounded-lg transition-all text-left",
                        "flex items-center gap-3",
                        formData.paymentMethod === "paystack"
                          ? "border-primary bg-primary/5"
                          : "border-gray-300 hover:border-gray-400"
                      )}
                    >
                      <CreditCard className={cn("w-5 h-5", formData.paymentMethod === "paystack" ? "text-primary" : "text-gray-400")} />
                      <div>
                        <div className="font-medium text-gray-900">{t("booking.form.paymentPaystack")}</div>
                        <div className="text-xs text-gray-500">
                          {isPaystackEnabled() ? "Secure online payment" : t("booking.form.paymentPaystackComingSoon")}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Booking Summary — show when Paystack enabled or as info for pay on arrival */}
                {bookingAmount.nights > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">{t("booking.form.totalAmount")}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>
                          {formData.roomType && t(`room.${formData.roomType}.title`)} × {bookingAmount.nights} {t("booking.form.nights")}
                        </span>
                        <span className="font-medium">₦{bookingAmount.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>{t("booking.form.tax")}</span>
                        <span className="font-medium">₦{bookingAmount.tax.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                        <span className="font-semibold text-gray-900">{t("booking.form.totalAmount")}</span>
                        <span className="font-bold text-primary text-lg">₦{bookingAmount.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || bookingAmount.total === 0}
                    className={cn(
                      "w-full px-8 py-4 rounded-lg relative overflow-hidden",
                      "bg-gradient-to-r from-primary to-primary/90 text-white font-semibold",
                      "hover:from-primary/95 hover:to-primary transition-all duration-300",
                      "flex items-center justify-center gap-2",
                      "shadow-lg hover:shadow-xl hover:shadow-primary/25",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-secondary/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                    )}
                    aria-label={formData.paymentMethod === "paystack" ? t("booking.form.payNow") : t("booking.form.submit")}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                          {formData.paymentMethod === "paystack" ? "Redirecting to payment..." : t("booking.form.processing")}
                        </>
                      ) : (
                        <>
                          {formData.paymentMethod === "paystack" ? (
                            <>
                              {t("booking.form.payNow")} - ₦{bookingAmount.total.toLocaleString()}
                              <CreditCard className="w-5 h-5" aria-hidden="true" />
                            </>
                          ) : (
                            <>
                              {t("booking.form.submit")}
                              <ArrowRight className="w-5 h-5" aria-hidden="true" />
                            </>
                          )}
                        </>
                      )}
                    </span>
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center pt-2">
                  {t("booking.form.terms")}
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
