import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const AICompanion = () => {
  return (
    <section className="bg-deep-purple py-20">
      <div className="content-container flex flex-col small:flex-row items-center gap-12">
        <div className="relative w-full small:w-1/2 bg-white/10 rounded-2xl h-72 overflow-hidden">
          <Image
            src="/serum.png"
            alt="AI Wellness Companion"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Text content */}
        <div className="w-full small:w-1/2">
          <h2 className="text-3xl small:text-4xl font-bold text-white leading-tight mb-4">
            Meet Your AI Wellness Companion.
          </h2>
          <p className="text-white/80 italic text-lg mb-6">
            Any time, day or night, here to listen and guide you. No rush. No judgement. No extra charge.
          </p>
          <LocalizedClientLink
            href="/store"
            className="inline-block bg-white text-deep-purple px-8 py-3 rounded-full text-sm font-medium hover:bg-grey-5 transition-colors"
          >
            Learn More
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default AICompanion
