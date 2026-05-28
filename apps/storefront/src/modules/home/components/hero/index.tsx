"use client"

import { useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const slides = [
  {
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1920&q=80&fit=crop",
    title: "Wellness, Redefined.",
    subtitle: "Curated essentials for a healthier, more intentional life.",
  },
  {
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1920&q=80&fit=crop",
    title: "Science-Backed Skincare",
    subtitle: "Formulations that actually work. No gimmicks, just results.",
  },
  {
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&q=80&fit=crop",
    title: "Feel Your Best, Daily",
    subtitle: "Supplements and routines designed for modern living.",
  },
]

const Hero = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full h-screen">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 content-container h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <h1
            key={current}
            className="text-5xl small:text-7xl medium:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-8 animate-fade-in-top"
          >
            {slides[current].title}
          </h1>
          <p className="text-xl small:text-2xl text-white/80 font-light mb-12 max-w-lg">
            {slides[current].subtitle}
          </p>
          <LocalizedClientLink
            href="/store"
            className="inline-block bg-white text-black px-10 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-grey-10 transition-colors"
          >
            Shop Collection
          </LocalizedClientLink>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? "w-10 bg-white" : "w-4 bg-white/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 right-8 z-10 hidden small:block">
        <div className="flex flex-col items-center gap-2 text-white/60 text-xs uppercase tracking-widest">
          <span>Scroll</span>
          <div className="w-px h-10 bg-white/40" />
        </div>
      </div>
    </section>
  )
}

export default Hero
