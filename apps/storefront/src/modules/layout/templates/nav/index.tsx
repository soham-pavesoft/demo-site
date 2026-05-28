import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="h-14 bg-white border-b border-grey-10">
        <nav className="content-container flex items-center justify-between h-full">
          <LocalizedClientLink href="/" className="text-lg font-bold text-black tracking-tight">
            Demo Site
          </LocalizedClientLink>

          <div className="hidden small:flex items-center gap-x-8 text-sm text-grey-60">
            <LocalizedClientLink href="/store" className="hover:text-black transition-colors">Shop</LocalizedClientLink>
            <LocalizedClientLink href="/account" className="hover:text-black transition-colors">Account</LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-4">
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
