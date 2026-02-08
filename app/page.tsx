"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Shield, Coffee, Wifi, Car, UtensilsCrossed, MapPin, Shirt, X } from "lucide-react"
import Image from "next/image"
import MobileNavbar from "@/components/MobileNavbar"
import DesktopNav from "@/components/DesktopNav"
import Footer from "@/components/Footer"
import BookingModal from "@/components/BookingModal"
import SwipeCarousel from "@/components/SwipeCarousel"
import { useLanguage } from "@/contexts/LanguageContext"
import { getContactPhone, getContactEmail } from "@/lib/site-config"
import { cn } from "@/lib/utils"

export default function Home() {
  const { t } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{ video: string; title: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [bookingVideoLoaded, setBookingVideoLoaded] = useState(false)
  const [bookingVideoError, setBookingVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const bookingVideoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    
    // Listen for booking modal open event from mobile navbar
    const handleOpenBookingModal = () => setIsBookingModalOpen(true)
    window.addEventListener('openBookingModal', handleOpenBookingModal)
    
    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener('openBookingModal', handleOpenBookingModal)
    }
  }, [])

  // Handle booking video loading
  useEffect(() => {
    const bookingVideo = bookingVideoRef.current
    if (!bookingVideo) return

    const handleCanPlay = () => {
      setBookingVideoLoaded(true)
      bookingVideo.play().catch(() => {
        // Autoplay failed, but video is ready
        setBookingVideoLoaded(true)
      })
    }

    const handleError = () => {
      setBookingVideoError(true)
      setBookingVideoLoaded(false)
    }

    const handleLoadedData = () => {
      if (bookingVideo.readyState >= 2) {
        setBookingVideoLoaded(true)
      }
    }

    bookingVideo.addEventListener('canplay', handleCanPlay)
    bookingVideo.addEventListener('error', handleError)
    bookingVideo.addEventListener('loadeddata', handleLoadedData)

    // Force video to start loading
    bookingVideo.load()

    return () => {
      bookingVideo.removeEventListener('canplay', handleCanPlay)
      bookingVideo.removeEventListener('error', handleError)
      bookingVideo.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [])

  const roomTypes = [
    {
      id: "1",
      title: t("room.studio.title"),
      description: t("room.studio.desc"),
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    },
    {
      id: "2",
      title: t("room.executive.title"),
      description: t("room.executive.desc"),
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    },
    {
      id: "3",
      title: t("room.vip.title"),
      description: t("room.vip.desc"),
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    },
  ]

  const hallVenues = [
    { id: "1", nameKey: "hall.boardRoom.name", price: 20000, capacity: 20, image: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80" },
    { id: "2", nameKey: "hall.rapha.name", price: 50000, capacity: 50, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" },
    { id: "3", nameKey: "hall.yaweh.name", price: 50000, capacity: 70, image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80" },
    { id: "4", nameKey: "hall.uriel.name", price: 70000, capacity: 70, image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80" },
    { id: "5", nameKey: "hall.hallelujah.name", price: 100000, capacity: 300, image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80" },
    { id: "6", nameKey: "hall.premises.name", price: 50000, capacity: 500, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80" },
  ]

  const amenities = [
    {
      id: "1",
      title: t("amenity.concierge.title"),
      icon: Shield,
      description: t("amenity.concierge.desc"),
    },
    {
      id: "2",
      title: t("amenity.dining.title"),
      icon: UtensilsCrossed,
      description: t("amenity.dining.desc"),
    },
    {
      id: "3",
      title: t("amenity.wifi.title"),
      icon: Wifi,
      description: t("amenity.wifi.desc"),
    },
    {
      id: "4",
      title: t("amenity.parking.title"),
      icon: Car,
      description: t("amenity.parking.desc"),
    },
    {
      id: "5",
      title: t("amenity.roomService.title"),
      icon: Coffee,
      description: t("amenity.roomService.desc"),
    },
    {
      id: "6",
      title: t("amenity.laundry.title"),
      icon: Shirt,
      description: t("amenity.laundry.desc"),
    },
  ]

  const galleryItems = [
    {
      id: "1",
      video: "/experienceebomi/reception.mp4",
      poster: "/experienceebomi/reception1.png",
      title: "Reception",
      span: "col-span-1 md:col-span-2",
    },
    {
      id: "2",
      video: "/experienceebomi/temple.mp4",
      poster: "/experienceebomi/temple1.png",
      title: "Temple",
      span: "col-span-1",
    },
    {
      id: "3",
      // Note: Filename is intentionally "premuimroom" (typo) to match actual file
      video: "/experienceebomi/premuimroom.mp4",
      poster: "/experienceebomi/premiumroom.png",
      title: "Premium Room",
      span: "col-span-1",
    },
    {
      id: "4",
      video: "/experienceebomi/prayercubicle.mp4",
      poster: "/experienceebomi/prayercubicle1.png",
      title: "Prayer Cubicles",
      span: "col-span-1 md:col-span-2",
    },
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Handle video loading
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setVideoLoaded(true)
      video.play().catch(() => {
        // Autoplay failed, but video is ready
        setVideoLoaded(true)
      })
    }

    const handleError = () => {
      setVideoError(true)
      setVideoLoaded(false)
    }

    const handleLoadedData = () => {
      // Video metadata loaded, start playing
      if (video.readyState >= 2) {
        setVideoLoaded(true)
      }
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('loadeddata', handleLoadedData)

    // Preload video metadata for faster start
    video.load()

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [])

  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden">
      {/* Desktop Navigation */}
      <DesktopNav />

      {/* Hero Section with Parallax */}
      <section
        id="hero"
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{ y, scale }}
          className="absolute inset-0 z-0"
        >
          <div className="relative w-full h-[120%]">
            {/* Poster Image - Shows while video loads */}
            {!videoLoaded && !videoError && (
              <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
                <Image
                  src="/ebomilogo.jpg"
                  alt="EBOMI Suites and Towers"
                  width={320}
                  height={180}
                  className="object-contain max-w-[90vw] max-h-[50vh]"
                  priority
                  sizes="(max-width: 768px) 80vw, 320px"
                />
                {/* Loading indicator */}
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Video Background */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
                videoLoaded ? "opacity-100" : "opacity-0"
              )}
              aria-label="EBOMI Suites Hero Video"
              poster="/ebomilogo.jpg"
            >
              {/* Primary H.264 source - best compatibility */}
              <source src="/heroslideshow/0204.mp4" type="video/mp4" />
            </video>

            {/* Fallback - shown if video fails to load */}
            {videoError && (
              <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
                <Image
                  src="/ebomilogo.jpg"
                  alt="EBOMI Suites and Towers"
                  width={320}
                  height={180}
                  className="object-contain max-w-[90vw] max-h-[50vh]"
                  sizes="(max-width: 768px) 80vw, 320px"
                />
              </div>
            )}

            <div className="absolute inset-0 bg-black/40" />
          </div>
        </motion.div>

        <motion.div
          style={{ opacity }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white mb-6 tracking-tight"
          >
            {t("hero.title")}
            <br />
            <span className="text-secondary">{t("hero.subtitle")}</span>
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 mb-8 font-light max-w-2xl mx-auto"
          >
            {t("hero.tagline")}
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className={cn(
                "px-8 py-4 rounded-lg",
                "bg-primary text-white font-medium",
                "hover:bg-primary/90 transition-all duration-300",
                "flex items-center gap-2 mx-auto",
                "shadow-lg hover:shadow-xl"
              )}
            >
              {t("hero.cta")}
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Room Types Section */}
      <section id="accommodations" className="py-20 md:py-32 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
              {t("section.accommodations.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("section.accommodations.subtitle")}
            </p>
          </motion.div>

          {isMobile ? (
            <SwipeCarousel
              items={roomTypes.map((room) => ({
                id: room.id,
                title: room.title,
                description: room.description,
                content: (
                  <div className="relative h-[400px] rounded-2xl overflow-hidden group">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${room.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-serif mb-2">{room.title}</h3>
                      <p className="text-white/80">{room.description}</p>
                    </div>
                  </div>
                ),
              }))}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roomTypes.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative h-[500px] rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${room.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl font-serif mb-2">{room.title}</h3>
                    <p className="text-white/80 mb-4">{room.description}</p>
                    <button className="text-secondary hover:text-secondary/80 transition-colors flex items-center gap-2" aria-label={`${t("room.learnMore")} ${room.title}`}>
                      {t("room.learnMore")}
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Halls & Venues Section */}
      <section id="halls" className="py-20 md:py-32 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
              {t("section.halls.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("section.halls.subtitle")}
            </p>
          </motion.div>

          {isMobile ? (
            <SwipeCarousel
              items={hallVenues.map((hall) => ({
                id: hall.id,
                title: t(hall.nameKey),
                content: (
                  <div className="relative h-[400px] rounded-2xl overflow-hidden group">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${hall.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-serif mb-2">{t(hall.nameKey)}</h3>
                      <p className="text-white/80">
                        {t("hall.capacity")}: {hall.capacity} · ₦{hall.price.toLocaleString()} {t("hall.perEvent")}
                      </p>
                    </div>
                  </div>
                ),
              }))}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hallVenues.map((hall, index) => (
                <motion.div
                  key={hall.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="relative h-[380px] rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${hall.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-serif mb-2">{t(hall.nameKey)}</h3>
                    <p className="text-white/80">
                      {t("hall.capacity")}: {hall.capacity} · ₦{hall.price.toLocaleString()} {t("hall.perEvent")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-20 md:py-32 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
              {t("section.amenities.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("section.amenities.subtitle")}
            </p>
          </motion.div>

          {isMobile ? (
            <SwipeCarousel
              items={amenities.map((amenity) => ({
                id: amenity.id,
                title: amenity.title,
                content: (
                  <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                    <amenity.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-serif mb-2">{amenity.title}</h3>
                    <p className="text-gray-600">{amenity.description}</p>
                  </div>
                ),
              }))}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {amenities.map((amenity, index) => (
                <motion.div
                  key={amenity.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow"
                >
                  <amenity.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-serif mb-2">{amenity.title}</h3>
                  <p className="text-gray-600">{amenity.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bento Grid Gallery Section */}
      <section id="gallery" className="py-20 md:py-32 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
              {t("section.gallery.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("section.gallery.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn(
                  "relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden group cursor-pointer",
                  item.span
                )}
                onClick={() => {
                  setSelectedVideo({ video: item.video, title: item.title })
                  setVideoModalOpen(true)
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ${item.title} video`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedVideo({ video: item.video, title: item.title })
                    setVideoModalOpen(true)
                  }
                }}
              >
                {/* Poster image — no loading spinner; click to open video in modal */}
                <div className="relative w-full h-full">
                  <Image
                    src={item.poster}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border-2 border-white/30">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-serif">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section
        id="booking-section"
        className="py-20 md:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden scroll-mt-20"
      >
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          {/* Poster Image - Shows while video loads */}
          {!bookingVideoLoaded && !bookingVideoError && (
            <div className="absolute inset-0 w-full h-full bg-black/80 flex items-center justify-center">
              <Image
                src="/ebomilogo.jpg"
                alt="EBOMI Suites and Towers"
                width={280}
                height={158}
                className="object-contain max-w-[70vw] max-h-[40vh] opacity-90"
                priority
                sizes="(max-width: 768px) 70vw, 280px"
              />
              {/* Loading indicator */}
              <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-10 h-10 border-4 border-white/20 border-t-white/40 rounded-full animate-spin" />
            </div>
          )}

          {/* Video Background */}
          <video
            ref={bookingVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
              bookingVideoLoaded ? "opacity-100" : "opacity-30"
            )}
            aria-label="EBOMI Suites Booking Video"
            poster="/ebomilogo.jpg"
          >
            <source src="/intro-1.mp4" type="video/mp4" />
          </video>

          {/* Fallback - shown if video fails to load */}
          {bookingVideoError && (
            <div className="absolute inset-0 w-full h-full bg-black/80 flex items-center justify-center">
              <Image
                src="/ebomilogo.jpg"
                alt="EBOMI Suites and Towers"
                width={280}
                height={158}
                className="object-contain max-w-[70vw] max-h-[40vh] opacity-90"
                sizes="(max-width: 768px) 70vw, 280px"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light text-white mb-6">
              {t("section.booking.title")}
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              {t("section.booking.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className={cn(
                  "px-8 py-4 rounded-lg",
                  "bg-primary text-white font-medium",
                  "hover:bg-primary/90 transition-all duration-300",
                  "flex items-center justify-center gap-2",
                  "shadow-lg hover:shadow-xl"
                )}
              >
                {t("booking.checkAvailability")}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
              <a
                href={`mailto:${getContactEmail()}`}
                className={cn(
                  "px-8 py-4 rounded-lg",
                  "bg-white/10 backdrop-blur-sm text-white border border-white/20",
                  "hover:bg-white/20 transition-all duration-300",
                  "font-medium text-center"
                )}
                aria-label={t("booking.contactConcierge")}
              >
                {t("booking.contactConcierge")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
              {t("section.testimonials.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("section.testimonials.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Sarah Mitchell",
                role: "Business Executive",
                content: "An exceptional experience from start to finish. The attention to detail and personalized service exceeded all expectations.",
                rating: 5,
              },
              {
                name: "James Anderson",
                role: "Travel Enthusiast",
                content: "The epitome of quiet luxury. Every moment was thoughtfully curated, and the accommodations were simply breathtaking.",
                rating: 5,
              },
              {
                name: "Emily Chen",
                role: "Luxury Traveler",
                content: "EBOMI Suites redefines hospitality. The seamless blend of modern elegance and timeless sophistication is unmatched.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-secondary text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-6">
                {t("section.location.title")}
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                {t("section.location.subtitle")}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{t("location.address.label")}</p>
                    <p className="text-gray-600">
                      {t("location.address")}<br />
                      {t("location.city")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Car className="w-6 h-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{t("location.transport")}</p>
                    <p className="text-gray-600 whitespace-pre-line">
                      {t("location.transport.desc")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <a
                  href="https://www.google.com/maps/place/EBOMI+MINISTRY+JOS/@9.9175488,8.8865592,16.58z/data=!4m15!1m8!3m7!1s0x105372536b432cc5:0x94868627c627e5aa!2s1+Kashim+Ibrahim+St,+Jos+930105,+Plateau!3b1!8m2!3d9.9195892!4d8.8871949!16s%2Fg%2F11jmb89hbq!3m5!1s0x1053725364f77613:0x999636db79703c60!8m2!3d9.9197096!4d8.8865214!16s%2Fg%2F11d_v1z710?entry=ttu&g_ep=EgoyMDI2MDIwMy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  aria-label={t("location.viewMap")}
                >
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                  {t("location.viewMap")}
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden"
            >
              <Image
                src="/ebomi.jpg"
                alt="EBOMI Suites and Towers location"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-6">
              {t("section.contact.title")}
            </h2>
            <p className="text-gray-600 mb-8">
              {t("section.contact.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${getContactPhone()}`}
                className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                aria-label={t("contact.call")}
              >
                {t("contact.call")}
              </a>
              <a
                href={`mailto:${getContactEmail()}`}
                className="px-6 py-3 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
                aria-label={t("contact.email")}
              >
                {t("contact.email")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Mobile Navbar */}
      <MobileNavbar />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      {/* Video Modal */}
      <AnimatePresence>
        {videoModalOpen && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setVideoModalOpen(false)
              setSelectedVideo(null)
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => {
                  setVideoModalOpen(false)
                  setSelectedVideo(null)
                }}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                aria-label="Close video"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Video player */}
              <div className="relative w-full aspect-video bg-black">
                <video
                  src={selectedVideo.video}
                  controls
                  autoPlay
                  className="w-full h-full"
                  onEnded={() => {
                    // Optional: Auto-close on video end
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {/* Video title */}
              <div className="p-6 bg-black/50">
                <h3 className="text-2xl font-serif text-white">{selectedVideo.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
