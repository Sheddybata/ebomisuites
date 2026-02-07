"use client"

interface FlagIconProps {
  countryCode: string
  className?: string
}

export default function FlagIcon({ countryCode, className }: FlagIconProps) {
  // Using flagcdn.com CDN - SVG format for perfectly crisp rendering at any size
  const flagUrl = `https://flagcdn.com/${countryCode.toLowerCase()}.svg`
  
  return (
    <img
      src={flagUrl}
      alt={`${countryCode} flag`}
      className={className}
      loading="lazy"
    />
  )
}
