const steps = [
  { num: "1", title: "Browse & Choose", description: "Explore our curated collection and find what works for you." },
  { num: "2", title: "Personalize", description: "Tell us about your goals so we can tailor recommendations." },
  { num: "3", title: "Delivered to You", description: "Get your products shipped fast with our satisfaction guarantee." },
]

const HowItWorks = () => {
  return (
    <section className="bg-cream py-16 small:py-24">
      <div className="content-container">
        <h2 className="text-3xl font-bold text-grey-90 text-center mb-4">
          How It Works
        </h2>
        <p className="text-grey-50 text-center mb-12">
          Exactly how you need it to work for you.
        </p>
        <div className="grid grid-cols-1 small:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-14 h-14 rounded-full bg-brand-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-grey-90 mb-2">{step.title}</h3>
              <p className="text-sm text-grey-50">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
