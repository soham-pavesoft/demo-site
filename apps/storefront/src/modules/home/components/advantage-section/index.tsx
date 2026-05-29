"use client"

import { useState } from "react"

const chips = [
  "Concierge Care at No Cost",
  "Save Money",
  "30-Day Money Back Guarantee",
  "24/7 AI Health Companion",
  "Advanced Wellness Tracker",
  "Members-Only Content",
]

const AdvantageSection = () => {
  const [active, setActive] = useState(0)

  return (
    <section className="py-20 bg-light-pink">
      <div className="content-container flex flex-col small:flex-row items-start gap-12">
        {/* Left content */}
        <div className="w-full small:w-1/2">
          <h2 className="text-3xl font-bold text-grey-90 mb-4">
            The Acme Wellness<br />Advantage
          </h2>
          <p className="text-grey-60 mb-8">
            We&apos;re not just another store. It&apos;s a{" "}
            <strong className="text-grey-90">wellness destination for people who want science-backed products</strong>{" "}
            and a better way to manage their health.
          </p>

          <div className="flex flex-col gap-3">
            {chips.map((chip, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-fit px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                  i === active
                    ? "bg-deep-purple text-white border-deep-purple"
                    : "bg-white text-grey-70 border-grey-20 hover:border-grey-40"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Right placeholder */}
        <div className="w-full small:w-1/2 flex items-center justify-center">
          <div className="relative">
            <div className="w-72 h-96 bg-grey-30 rounded-2xl" />
            <div className="absolute bottom-8 right-0 bg-white rounded-xl px-6 py-4 shadow-lg max-w-[200px]">
              <p className="text-sm font-medium text-grey-90 text-center">
                Personalized service with compassionate care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdvantageSection
