const testimonials = [
  {
    quote: "It helps people feel their best with compassion and honesty.",
    color: "bg-deep-purple",
  },
  {
    quote: "Someone actually looks at the total picture - experts who understand that science helps people by reviewing what works.",
    color: "bg-coral",
  },
  {
    quote: "It's a place that can be there for you through your whole wellness journey.",
    color: "bg-dark-green",
  },
]

const Testimonials = () => {
  return (
    <section className="py-20 bg-light-pink">
      <div className="content-container">
        <h2 className="text-3xl small:text-4xl font-bold text-center text-grey-90 mb-12">
          What customers say about Acme Wellness
        </h2>

        <div className="grid grid-cols-1 small:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="p-8">
                <span className="text-4xl text-grey-30 leading-none">&ldquo;</span>
                <p className="text-grey-70 text-sm mt-2">{t.quote}</p>
              </div>
              <div className={`h-2 ${t.color}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
