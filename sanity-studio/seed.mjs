#!/usr/bin/env node
/**
 * Seed Sanity with dummy content.
 * Usage: SANITY_STUDIO_PROJECT_ID=xxx SANITY_API_TOKEN=xxx node seed.mjs
 */
import { createClient } from "@sanity/client"

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const token = process.env.SANITY_API_TOKEN

if (!projectId || projectId === "YOUR_PROJECT_ID") {
  console.error("❌ Set SANITY_STUDIO_PROJECT_ID"); process.exit(1)
}
if (!token) {
  console.error("❌ Set SANITY_API_TOKEN (create at sanity.io/manage → API → Tokens)"); process.exit(1)
}

const client = createClient({ projectId, dataset: "production", apiVersion: "2024-01-01", token, useCdn: false })

const tx = client.transaction()

tx.createOrReplace({ _type: "roarmdPage", _id: "roarmdPage", heroTitle: "The RoarMD Advantage", heroSubtitle: "We combine cutting-edge science with nature's finest ingredients to deliver wellness products that actually work." })

const banners = [
  { title: "Unlock Your Best Self", subtitle: "Science-backed wellness products for modern living", ctaText: "Shop Now", ctaLink: "/store", order: 1 },
  { title: "Summer Wellness Sale", subtitle: "Up to 30% off on select supplements", ctaText: "View Deals", ctaLink: "/store", order: 2 },
  { title: "New: Collagen Peptides", subtitle: "Premium hydrolyzed collagen for skin, hair & joints", ctaText: "Learn More", ctaLink: "/store", order: 3 },
]
banners.forEach((b) => tx.create({ _type: "heroBanner", ...b }))

const posts = [
  { title: "The Science of Vitamin D3 + K2", excerpt: "Discover why combining these two vitamins creates a powerful synergy for bone and heart health.", publishedAt: "2024-12-15T10:00:00Z" },
  { title: "Collagen: Beyond Skin Deep", excerpt: "How collagen peptides support joints, gut health, and overall vitality.", publishedAt: "2024-12-10T10:00:00Z" },
  { title: "Magnesium: The Relaxation Mineral", excerpt: "Why glycinate is the superior form for sleep, stress, and muscle recovery.", publishedAt: "2024-12-05T10:00:00Z" },
  { title: "Omega-3 Fatty Acids Explained", excerpt: "EPA vs DHA — understanding which omega-3s your body needs and why.", publishedAt: "2024-11-28T10:00:00Z" },
  { title: "Retinol: A Dermatologist's Guide", excerpt: "How to introduce retinol into your routine without irritation.", publishedAt: "2024-11-20T10:00:00Z" },
]
posts.forEach((p) => tx.create({ _type: "blogPost", ...p }))

const sections = [
  { title: "Science-Backed Formulations", subtitle: "Every product is developed with peer-reviewed research and clinical-grade ingredients.", icon: "🔬", order: 1 },
  { title: "Transparent Sourcing", subtitle: "We trace every ingredient back to its origin. No fillers, no mystery blends.", icon: "🌿", order: 2 },
  { title: "Third-Party Tested", subtitle: "Independent labs verify purity, potency, and safety of every batch we produce.", icon: "✅", order: 3 },
  { title: "Sustainable Packaging", subtitle: "Eco-conscious packaging that reduces waste without compromising product integrity.", icon: "♻️", order: 4 },
]
sections.forEach((s) => tx.create({ _type: "roarmdSection", ...s }))

await tx.commit()
console.log("✅ Seeded: 3 banners, 5 blog posts, 4 sections, 1 page")
