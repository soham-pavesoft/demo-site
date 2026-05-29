import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import TrustSection from "@modules/home/components/trust-section"
import CategoryCards from "@modules/home/components/category-cards"
import AICompanion from "@modules/home/components/ai-companion"
import AdvantageSection from "@modules/home/components/advantage-section"
import HowItWorks from "@modules/home/components/how-it-works"
import Testimonials from "@modules/home/components/testimonials"

export const metadata: Metadata = {
  title: "Acme Wellness | Premium Wellness Products",
  description: "Discover science-backed wellness products designed to help you feel your best.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  return (
    <>
      <Hero />
      <TrustSection />
      <CategoryCards />
      <AICompanion />
      <AdvantageSection />
      <HowItWorks />
      <Testimonials />
    </>
  )
}
