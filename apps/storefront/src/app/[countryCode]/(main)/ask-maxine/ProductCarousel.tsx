"use client"

import Image from "next/image"
import { useRef } from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type MaxineProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  price: string | null
}

const ProductCarousel = ({ products }: { products: MaxineProduct[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollBy = (direction: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" })
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous products"
        onClick={() => scrollBy(-1)}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-grey-20 shadow-sm flex items-center justify-center text-grey-60 hover:text-deep-purple transition-colors"
      >
        <FiChevronLeft />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product) => (
          <LocalizedClientLink
            key={product.id}
            href={`/products/${product.handle}`}
            className="w-40 shrink-0 group rounded-2xl bg-white border border-grey-20 p-2 shadow-sm hover:ring-2 hover:ring-deep-purple/40 transition-all"
          >
            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-light-pink">
              {product.thumbnail && (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  sizes="160px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            <p className="mt-2 text-sm text-grey-90 font-medium leading-snug line-clamp-2">
              {product.title}
            </p>
            {product.price && (
              <p className="text-xs text-coral mt-0.5">{product.price} →</p>
            )}
          </LocalizedClientLink>
        ))}
      </div>
      <button
        type="button"
        aria-label="Next products"
        onClick={() => scrollBy(1)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-grey-20 shadow-sm flex items-center justify-center text-grey-60 hover:text-deep-purple transition-colors"
      >
        <FiChevronRight />
      </button>
    </div>
  )
}

export default ProductCarousel
