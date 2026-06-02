import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  let regions: StoreRegion[] = []
  let locales: any[] = []
  let currentLocale: any = null

  try {
    ;[regions, locales, currentLocale] = await Promise.all([
      listRegions().then((r: StoreRegion[]) => r),
      listLocales(),
      getLocale(),
    ])
  } catch {}

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="h-16 bg-white border-b border-grey-10">
        <nav className="content-container flex items-center justify-between h-full">
          <LocalizedClientLink href="/" className="text-xl font-bold text-black tracking-tight">
            Acme Wellness
          </LocalizedClientLink>

          <div className="hidden small:flex items-center gap-x-8 text-sm text-grey-60">
            <LocalizedClientLink href="/store" className="hover:text-black transition-colors">Products</LocalizedClientLink>
            <LocalizedClientLink href="/discover" className="hover:text-black transition-colors">Discover</LocalizedClientLink>
            <LocalizedClientLink href="/roarmd-advantage" className="hover:text-black transition-colors">The Advantage</LocalizedClientLink>
            <LocalizedClientLink href="/store" className="hover:text-black transition-colors">About Us</LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-4">
            <LocalizedClientLink
              href="/store"
              className="hidden small:inline-block bg-deep-purple text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Join for Free
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink className="text-sm text-grey-60" href="/cart">Cart (0)</LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
            <div className="small:hidden">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
