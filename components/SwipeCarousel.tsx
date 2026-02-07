"use client"

import { useState, useRef, useEffect } from "react"
import { motion, PanInfo, useMotionValue } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SwipeCarouselProps {
  items: Array<{
    id: string
    title: string
    description?: string
    image?: string
    content: React.ReactNode
  }>
  className?: string
}

export default function SwipeCarousel({ items, className }: SwipeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (info.offset.x < -threshold && currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
    x.set(0)
  }

  useEffect(() => {
    x.set(-currentIndex * 100)
  }, [currentIndex, x])

  return (
    <div className={className} ref={constraintsRef}>
      <div className="relative overflow-hidden">
        <motion.div
          className="flex"
          style={{ x }}
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(e, info) => {
            handleDragEnd(e, info)
            setIsDragging(false)
          }}
          animate={{
            x: `-${currentIndex * 100}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="w-full flex-shrink-0 px-4"
              style={{ minWidth: "100%" }}
            >
              {item.content}
            </div>
          ))}
        </motion.div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrow Navigation (Desktop) */}
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
        )}
        {currentIndex < items.length - 1 && (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        )}
      </div>
    </div>
  )
}
