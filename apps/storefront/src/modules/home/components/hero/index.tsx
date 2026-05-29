import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative w-full bg-cream overflow-hidden">
      {/* Large brand text */}
      <div className="content-container pt-8">
        <h1 className="text-[8rem] small:text-[12rem] medium:text-[16rem] font-bold text-coral leading-[0.85] tracking-tight select-none">
          Acme Wellness
        </h1>
      </div>

      {/* Content area */}
      <div className="content-container pb-16 pt-8 flex flex-col small:flex-row items-start gap-12">
        <div className="max-w-xl">
          <h2 className="text-3xl small:text-5xl font-serif italic text-grey-90 leading-tight mb-6">
            Premium Wellness for Modern Living
          </h2>
          <p className="text-grey-60 text-lg mb-2">
            Your wellness journey starts here.
          </p>
          <p className="text-grey-90 font-semibold text-lg mb-1">
            Get the personalized care you deserve.
          </p>
          <p className="text-grey-60 text-lg mb-8">
            Powered by science and crafted with care for those who refuse to settle.
          </p>
          <LocalizedClientLink
            href="/store"
            className="inline-block bg-deep-purple text-white px-8 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </LocalizedClientLink>
        </div>
      </div>

      {/* Trust bar */}
      <div className="w-full bg-coral py-3">
        <div className="content-container">
          <p className="text-center text-white text-sm font-medium">
            Licensed Experts • Premium Ingredients • Science-Backed • FDA-Compliant • Satisfaction Guaranteed
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero
