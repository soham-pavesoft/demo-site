import { Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  return (
    <footer className="border-t border-grey-10 w-full">
      <div className="content-container py-12 flex flex-col small:flex-row justify-between items-start gap-8">
        <div>
          <h3 className="text-lg font-bold text-black mb-2">Demo Site</h3>
          <p className="text-sm text-grey-50 max-w-xs">A demo storefront powered by MedusaJS + Next.js.</p>
        </div>
        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-2 text-grey-60">
            <LocalizedClientLink href="/store" className="hover:text-black">Shop</LocalizedClientLink>
            <LocalizedClientLink href="/account" className="hover:text-black">Account</LocalizedClientLink>
            <LocalizedClientLink href="/cart" className="hover:text-black">Cart</LocalizedClientLink>
          </div>
          <div className="flex flex-col gap-2 text-grey-60">
            <a href="#" className="hover:text-black">About</a>
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Terms</a>
          </div>
        </div>
      </div>
      <div className="content-container pb-8">
        <Text className="text-xs text-grey-40">© {new Date().getFullYear()} Demo Site. All rights reserved.</Text>
      </div>
    </footer>
  )
}
