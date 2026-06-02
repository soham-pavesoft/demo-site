import { notFound } from "next/navigation"
import { getBlogPost } from "@/sanity/queries"
import { urlFor } from "@/sanity/client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug).catch(() => null)

  if (!post) return notFound()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative bg-deep-purple text-white py-20 px-6">
        {post.image && (
          <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${urlFor(post.image).width(1440).url()})` }} />
        )}
        <div className="relative content-container max-w-3xl">
          <LocalizedClientLink href="/discover" className="text-sm opacity-70 hover:opacity-100 mb-4 inline-block">← Back to Discover</LocalizedClientLink>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{post.title}</h1>
          {post.publishedAt && (
            <p className="text-sm opacity-70">{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          )}
        </div>
      </div>

      {/* Body */}
      <article className="content-container max-w-3xl py-12">
        {post.excerpt && <p className="text-lg text-grey-60 mb-8 leading-relaxed">{post.excerpt}</p>}
        {post.body?.map((block: any) => {
          if (block._type === "block") {
            const text = block.children?.map((c: any) => c.text).join("") || ""
            if (block.style === "h2") return <h2 key={block._key} className="text-2xl font-bold text-grey-90 mt-8 mb-4">{text}</h2>
            if (block.style === "h3") return <h3 key={block._key} className="text-xl font-bold text-grey-90 mt-6 mb-3">{text}</h3>
            return <p key={block._key} className="text-grey-70 leading-relaxed mb-4">{text}</p>
          }
          if (block._type === "image") {
            return <img key={block._key} src={urlFor(block).width(800).url()} alt="" className="rounded-lg my-8 w-full" />
          }
          return null
        })}
      </article>
    </div>
  )
}
