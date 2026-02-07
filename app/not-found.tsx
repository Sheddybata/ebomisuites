"use client"

import { motion } from "framer-motion"
import { Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function NotFound() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-9xl font-serif text-primary mb-4"
        >
          404
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let us help you find what you need.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className={cn(
              "px-8 py-4 rounded-lg",
              "bg-primary text-white font-medium",
              "hover:bg-primary/90 transition-all duration-300",
              "flex items-center justify-center gap-2",
              "shadow-lg hover:shadow-xl"
            )}
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className={cn(
              "px-8 py-4 rounded-lg",
              "bg-white text-gray-900 font-medium border-2 border-gray-200",
              "hover:bg-gray-50 transition-all duration-300",
              "flex items-center justify-center gap-2"
            )}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {[
            { title: "Accommodations", href: "#accommodations", icon: "🏨" },
            { title: "Amenities", href: "#amenities", icon: "✨" },
            { title: "Contact", href: "#contact", icon: "📞" },
          ].map((item, index) => (
            <motion.a
              key={item.href}
              href={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">Explore our {item.title.toLowerCase()}</p>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
