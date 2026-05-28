const testimonials = [
  { quote: "The quality is incredible. I've never felt better about what I'm putting on my skin.", author: "Sarah M." },
  { quote: "Finally, a brand that actually listens and delivers personalized solutions.", author: "Jessica R." },
  { quote: "A place that can be there for you through your whole wellness journey.", author: "Amanda K." },
]

const Testimonials = () => {
  return (
    <section className="content-container py-16 small:py-24">
      <h2 className="text-3xl font-bold text-grey-90 text-center mb-12">
        What Our Customers Say
      </h2>
      <div className="grid grid-cols-1 small:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-grey-10">
            <svg className="w-8 h-8 text-brand-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z"/>
            </svg>
            <p className="text-grey-60 mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
            <p className="text-sm font-semibold text-brand-600">— {t.author}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
