import { Metadata } from "next"
import { getRoarmdSections, getRoarmdPage } from "@/sanity/queries"
import { urlFor } from "@/sanity/client"

export const metadata: Metadata = {
  title: "The RoarMD Advantage",
  description: "Discover what sets RoarMD apart — science-backed formulations, transparent sourcing, and results you can feel.",
}

const fallbackPage = {
  heroTitle: "The RoarMD Advantage",
  heroSubtitle: "We combine cutting-edge science with nature's finest ingredients to deliver wellness products that actually work.",
  heroImage: null,
}

const fallbackSections = [
  { _id: "1", title: "Science-Backed Formulations", subtitle: "Every product is developed with peer-reviewed research and clinical-grade ingredients.", icon: "🔬", image: null, body: null },
  { _id: "2", title: "Transparent Sourcing", subtitle: "We trace every ingredient back to its origin. No fillers, no mystery blends.", icon: "🌿", image: null, body: null },
  { _id: "3", title: "Third-Party Tested", subtitle: "Independent labs verify purity, potency, and safety of every batch we produce.", icon: "✅", image: null, body: null },
  { _id: "4", title: "Sustainable Packaging", subtitle: "Eco-conscious packaging that reduces waste without compromising product integrity.", icon: "♻️", image: null, body: null },
]

export default async function RoarMDAdvantagePage({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params
  let page = fallbackPage
  let sections = fallbackSections

  try {
    const fetchedPage = await getRoarmdPage()
    if (fetchedPage) page = fetchedPage
    const fetchedSections = await getRoarmdSections()
    if (fetchedSections?.length) sections = fetchedSections
  } catch (e) {
    console.error("[Sanity] Failed to fetch RoarMD page data:", e)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-deep-purple text-white py-24 px-6">
        {page.heroImage && (
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${urlFor(page.heroImage).width(1440).url()})` }}
          />
        )}
        <div className="relative text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{page.heroTitle}</h1>
          {page.heroSubtitle && <p className="text-lg md:text-xl opacity-90">{page.heroSubtitle}</p>}
        </div>
      </section>

      {/* Advantage Sections */}
      <section className="content-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section: any, i: number) => (
            <div
              key={section._id}
              className={`rounded-large p-8 ${i % 2 === 0 ? "bg-light-pink" : "bg-white border border-grey-20"}`}
            >
              {section.image ? (
                <img
                  src={urlFor(section.image).width(600).height(300).url()}
                  alt={section.title}
                  className="w-full h-40 object-cover rounded-rounded mb-6"
                />
              ) : (
                <div className="text-4xl mb-4">{section.icon || "✨"}</div>
              )}
              <h3 className="text-xl font-bold text-deep-purple mb-2">{section.title}</h3>
              {section.subtitle && <p className="text-grey-50 text-sm">{section.subtitle}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-green text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands who trust RoarMD for their daily wellness routine.
        </p>
        <a
          href={`/${countryCode}/store`}
          className="inline-block px-8 py-3 bg-coral text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Shop Products
        </a>
      </section>
    </div>
  )
}
