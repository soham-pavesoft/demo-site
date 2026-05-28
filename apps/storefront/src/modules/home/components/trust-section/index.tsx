const features = [
  { title: "Free Shipping", desc: "On all orders over €50" },
  { title: "30-Day Returns", desc: "No questions asked" },
  { title: "Expert Support", desc: "Available 24/7" },
]

const TrustSection = () => {
  return (
    <section className="w-full bg-grey-5 border-b border-grey-10">
      <div className="content-container py-12 grid grid-cols-1 small:grid-cols-3 gap-8 text-center">
        {features.map((f) => (
          <div key={f.title}>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wide mb-1">{f.title}</h3>
            <p className="text-sm text-grey-50">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrustSection
