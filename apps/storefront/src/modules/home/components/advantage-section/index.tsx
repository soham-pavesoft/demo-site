const AdvantageSection = () => {
  return (
    <section className="w-full bg-black text-white">
      <div className="content-container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
        <p className="text-grey-40 max-w-lg mx-auto mb-10">
          We cut out the middlemen. You get premium products at honest prices, backed by science and shipped fast.
        </p>
        <div className="grid grid-cols-2 small:grid-cols-4 gap-8 text-sm">
          <div>
            <p className="text-2xl font-bold mb-1">50k+</p>
            <p className="text-grey-40">Customers</p>
          </div>
          <div>
            <p className="text-2xl font-bold mb-1">4.9★</p>
            <p className="text-grey-40">Rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold mb-1">2-Day</p>
            <p className="text-grey-40">Shipping</p>
          </div>
          <div>
            <p className="text-2xl font-bold mb-1">100%</p>
            <p className="text-grey-40">Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdvantageSection
