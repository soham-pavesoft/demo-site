import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const categories = [
  {
    title: "Skin & Beauty",
    handle: "skin-beauty",
    description: "Premium skincare formulations designed to restore radiance and help you look as good as you feel.",
    color: "bg-deep-purple",
    image: "/skin-radiance.png",
  },
  {
    title: "Vitality & Energy",
    handle: "vitality-energy",
    description: "Science-backed supplements to boost your energy, support metabolism, and keep you thriving daily.",
    color: "bg-coral",
    image: "/coQ.png",
  },
  {
    title: "Longevity & Wellness",
    handle: "longevity-wellness",
    description: "Targeted nutrition designed to support long-term health, stronger bones, and a sharper mind.",
    color: "bg-dark-green",
    image: "/nmn.png",
  },
]

const CategoryCards = () => {
  return (
    <section className="py-20 bg-cream">
      <div className="content-container">
        <h2 className="text-4xl small:text-5xl font-serif italic text-center text-grey-90 mb-4">
          Real products for real results.
        </h2>
        <p className="text-center text-grey-60 mb-12">
          Wherever you are in your journey, <strong className="text-grey-90">feeling better starts now</strong>.
        </p>

        <div className="grid grid-cols-1 small:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-48 bg-grey-10">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold italic text-grey-90 mb-3">{cat.title}</h3>
                <p className="text-grey-60 text-sm mb-6">{cat.description}</p>
              </div>
              <LocalizedClientLink
                href={`/categories/${cat.handle}`}
                className={`block w-full ${cat.color} text-white text-center py-4 font-medium text-sm hover:opacity-90 transition-opacity`}
              >
                Learn More
              </LocalizedClientLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryCards
