import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FiInstagram, FiFacebook, FiLinkedin, FiYoutube } from "react-icons/fi"

export default async function Footer() {
  return (
    <footer className="bg-[#1a1145] text-white w-full">
      <div className="content-container py-16">
        <div className="grid grid-cols-1 small:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-3">Acme Wellness</h3>
            <p className="text-white/60 text-sm mb-6">Modern wellness for people who refuse to settle.</p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                <FiInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                <FiFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                <FiLinkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                <FiYoutube className="w-4 h-4" />
              </a>
            </div>
            <h4 className="text-sm font-semibold mt-6 mb-1">Availability</h4>
            <p className="text-white/60 text-sm">Ships worldwide.</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><LocalizedClientLink href="/store" className="hover:text-white transition-colors">The Advantage</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/store" className="hover:text-white transition-colors">FAQ</LocalizedClientLink></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><LocalizedClientLink href="/store" className="hover:text-white transition-colors">Skin & Beauty</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/store" className="hover:text-white transition-colors">Vitality & Energy</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/store" className="hover:text-white transition-colors">Longevity & Wellness</LocalizedClientLink></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col small:flex-row justify-between text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} Acme Wellness. All rights reserved.</p>
          <p className="mt-2 small:mt-0">Premium wellness products, delivered with care.</p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-white/30 mt-8 text-center max-w-4xl mx-auto">
          Acme Wellness provides wellness products for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Consult a healthcare professional before starting any supplement regimen.
        </p>
      </div>

      {/* Large brand watermark */}
      <div className="content-container pb-8 overflow-hidden">
        <p className="text-[6rem] small:text-[10rem] font-bold text-white/5 leading-none select-none">
          Acme Wellness
        </p>
      </div>
    </footer>
  )
}
