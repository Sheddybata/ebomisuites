"use client"

import { cn } from "@/lib/utils"

export function ImageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 rounded-lg",
        className
      )}
    />
  )
}

export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-gray-200 rounded animate-pulse",
            i === lines - 1 && "w-3/4"
          )}
        />
      ))}
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 bg-white rounded-2xl shadow-lg", className)}>
      <div className="h-48 bg-gray-200 rounded-lg mb-4 animate-pulse" />
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
    </div>
  )
}

export function RoomCardSkeleton() {
  return (
    <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
      <div className="absolute inset-0" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="h-8 bg-white/20 rounded w-1/2 mb-2" />
        <div className="h-4 bg-white/20 rounded w-3/4 mb-4" />
        <div className="h-10 bg-white/20 rounded w-24" />
      </div>
    </div>
  )
}
