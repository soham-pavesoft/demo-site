import LocalizedClientLink from "@modules/common/components/localized-client-link"

const steps = [
  "Choose the area of wellness and the product you want",
  "Complete a quick onboarding questionnaire",
  "Submit your order. See our guarantee.",
]

const HowItWorks = () => {
  return (
    <section className="py-20 bg-cream">
      <div className="content-container flex flex-col small:flex-row items-start gap-16">
        {/* Left heading */}
        <div className="w-full small:w-1/3">
          <h2 className="text-3xl small:text-4xl font-bold text-grey-90 leading-tight">
            How does<br />Acme Wellness work?
          </h2>
          <p className="text-grey-60 mt-4">Exactly how you need it to work for you.</p>
        </div>

        {/* Right steps */}
        <div className="w-full small:w-2/3">
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-coral flex items-center justify-center flex-shrink-0">
                  <span className="text-coral font-bold">{i + 1}</span>
                </div>
                <p className="text-grey-90 text-lg pt-1.5">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <LocalizedClientLink
              href="/store"
              className="inline-block bg-deep-purple text-white px-8 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start an Order
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
