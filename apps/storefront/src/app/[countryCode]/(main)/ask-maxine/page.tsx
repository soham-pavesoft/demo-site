import { Metadata } from "next"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import AskMaxineChat from "./AskMaxineChat"
import { MaxineProduct } from "./ProductCarousel"

export const metadata: Metadata = {
  title: "Ask Maxine",
  description:
    "Chat with Maxine, your personal wellness guide from Acme Wellness.",
}

export default async function AskMaxinePage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  let products: MaxineProduct[] = []
  try {
    const { response } = await listProducts({
      countryCode,
      queryParams: { limit: 8 },
    })
    products = response.products.map((product) => {
      const { cheapestPrice } = getProductPrice({ product })
      return {
        id: product.id,
        title: product.title ?? "",
        handle: product.handle ?? "",
        thumbnail: product.thumbnail ?? product.images?.[0]?.url ?? null,
        price: cheapestPrice?.calculated_price ?? null,
      }
    })
  } catch (e) {
    console.error("[ask-maxine] failed to load products:", e)
  }

  return <AskMaxineChat products={products} countryCode={countryCode} />
}
