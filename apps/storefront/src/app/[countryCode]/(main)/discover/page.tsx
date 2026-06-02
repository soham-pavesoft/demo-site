import { Metadata } from "next"
import { getHeroBanners, getBlogPosts } from "@/sanity/queries"
import { urlFor } from "@/sanity/client"

export const metadata: Metadata = {
  title: "Discover | RoarMD",
  description: "Latest wellness insights, promotions and featured content.",
}

// Fallback data when Sanity is not configured
const fallbackBanners = [
  { _id: "1", title: "Unlock Your Best Self", subtitle: "Science-backed wellness products for modern living", ctaText: "Shop Now", ctaLink: "/us/store", image: null },
  { _id: "2", title: "Summer Wellness Sale", subtitle: "Up to 30% off on select supplements", ctaText: "View Deals", ctaLink: "/us/store", image: null },
]

const fallbackBlogs = [
  { _id: "1", title: "The Science of Vitamin D3 + K2", excerpt: "Discover why combining these two vitamins creates a powerful synergy for bone and heart health.", image: null, publishedAt: "2024-12-15" },
  { _id: "2", title: "Collagen: Beyond Skin Deep", excerpt: "How collagen peptides support joints, gut health, and overall vitality.", image: null, publishedAt: "2024-12-10" },
  { _id: "3", title: "Magnesium: The Relaxation Mineral", excerpt: "Why glycinate is the superior form for sleep, stress, and muscle recovery.", image: null, publishedAt: "2024-12-05" },
]

export default async function DiscoverPage({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params
  let banners = fallbackBanners
  let blogs = fallbackBlogs

  try {
    const fetchedBanners = await getHeroBanners()
    if (fetchedBanners?.length) banners = fetchedBanners
    const fetchedBlogs = await getBlogPosts()
    if (fetchedBlogs?.length) blogs = fetchedBlogs
  } catch (e) {
    console.error("[Sanity] Failed to fetch discover page data:", e)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banners */}
      <section className="relative">
        {banners.map((banner: any, i: number) => (
          <div
            key={banner._id}
            className={`relative flex items-center justify-center py-24 px-6 ${i === 0 ? "bg-deep-purple text-white" : "bg-light-pink text-grey-90"}`}
          >
            {banner.image && (
              <div
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: `url(${urlFor(banner.image).width(1440).url()})` }}
              />
            )}
            <div className="relative text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{banner.title}</h1>
              {banner.subtitle && <p className="text-lg md:text-xl opacity-90 mb-8">{banner.subtitle}</p>}
              {banner.ctaText && (
                <a
                  href={banner.ctaLink || `/${countryCode}/store`}
                  className="inline-block px-8 py-3 bg-coral text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  {banner.ctaText}
                </a>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Blog Section */}
      <section className="content-container py-16">
        <h2 className="text-3xl font-bold text-deep-purple mb-2">Wellness Insights</h2>
        <p className="text-grey-50 mb-10">Expert articles to guide your wellness journey</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post: any) => (
            <article key={post._id} className="bg-white rounded-large overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-light-pink flex items-center justify-center">
                {post.image ? (
                  <img src={urlFor(post.image).width(400).height(200).url()} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">📖</span>
                )}
              </div>
              <div className="p-6">
                <p className="text-xs text-coral font-semibold mb-2">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                </p>
                <h3 className="text-lg font-semibold text-grey-90 mb-2">{post.title}</h3>
                {post.excerpt && <p className="text-sm text-grey-50 line-clamp-3">{post.excerpt}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
