"use client"

import { FiShield, FiHeart, FiClock } from "react-icons/fi"
import { FiCheckCircle } from "react-icons/fi"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const features = [
  {
    icon: FiHeart,
    title: "Expert care centered on you",
    points: ["Wellness specialists", "Curated formulations", "Members-only community"],
  },
  {
    icon: FiShield,
    title: "Trust built into every product",
    points: ["FDA-compliant facilities", "Secure & transparent", "Third-party tested"],
  },
  {
    icon: FiClock,
    title: "What you need when you need it",
    points: ["Fast shipping included", "Products at fair prices", "24/7 support"],
  },
]

const TrustSection = () => {
  return (
    <section className="bg-deep-purple py-20">
      <div className="content-container">
        <div className="grid grid-cols-1 small:grid-cols-3 gap-8 mb-12">
          {features.map((f, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto w-32 h-32 border-2 border-white/40 rounded-2xl flex items-center justify-center mb-6">
                <f.icon className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-white text-xl font-bold mb-4">{f.title}</h3>
              <ul className="space-y-2">
                {f.points.map((p, j) => (
                  <li key={j} className="flex items-center gap-2 text-white/80 text-sm justify-center">
                    <FiCheckCircle className="w-4 h-4 text-white/60 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center">
          <LocalizedClientLink
            href="/store"
            className="inline-block bg-white text-deep-purple px-8 py-3 rounded-full text-sm font-medium hover:bg-grey-5 transition-colors"
          >
            Join for Free
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default TrustSection
