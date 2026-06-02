"use client"

import { useState, useEffect, useCallback } from "react"

interface Banner {
  _id: string
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  imageUrl?: string | null
}

export default function HeroCarousel({ banners, countryCode }: { banners: Banner[]; countryCode: string }) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((c) => (c + 1) % banners.length), [banners.length])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + banners.length) % banners.length), [banners.length])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative h-[70vh] min-h-[400px] overflow-hidden">
      {banners.map((banner, i) => (
        <div
          key={banner._id}
          className={`absolute inset-0 flex items-center justify-center px-6 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          style={{ backgroundColor: "#2d1b69" }}
        >
          {banner.imageUrl && (
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${banner.imageUrl})` }} />
          )}
          <div className="relative text-center max-w-3xl mx-auto text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{banner.title}</h1>
            {banner.subtitle && <p className="text-lg md:text-xl opacity-90 mb-8">{banner.subtitle}</p>}
            {banner.ctaText && (
              <a href={banner.ctaLink || `/${countryCode}/store`} className="inline-block px-8 py-3 bg-coral text-white rounded-full font-semibold hover:opacity-90 transition-opacity">
                {banner.ctaText}
              </a>
            )}
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-xl backdrop-blur-sm transition">‹</button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-xl backdrop-blur-sm transition">›</button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition ${i === current ? "bg-white" : "bg-white/40"}`} />
        ))}
      </div>
    </section>
  )
}
