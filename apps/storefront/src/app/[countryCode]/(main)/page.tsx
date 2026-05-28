import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import TrustSection from "@modules/home/components/trust-section"
import CategoryCards from "@modules/home/components/category-cards"
import AdvantageSection from "@modules/home/components/advantage-section"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Pavesoft | Premium Wellness Products",
  description: "Discover science-backed wellness products designed to help you feel your best.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <TrustSection />
      <CategoryCards />
      <AdvantageSection />
    </>
  )
}
