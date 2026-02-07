"use client"

export default function SkipToContent() {
  return (
    <a
      href="#hero"
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
        focus:z-50 focus:px-4 focus:py-2
        focus:bg-primary focus:text-white
        focus:rounded-lg focus:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        transition-all duration-200
      `}
      onClick={(e) => {
        e.preventDefault()
        const hero = document.getElementById("hero")
        if (hero) {
          hero.focus()
          hero.scrollIntoView({ behavior: "smooth" })
        }
      }}
    >
      Skip to main content
    </a>
  )
}
