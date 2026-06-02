import { client } from "./client"

export async function getHeroBanners() {
  return client.fetch(`*[_type == "heroBanner"] | order(order asc)`)
}

export async function getBlogPosts() {
  return client.fetch(`*[_type == "blogPost"] | order(publishedAt desc)[0...6]{_id, title, slug, excerpt, image, publishedAt}`)
}

export async function getBlogPost(slug: string) {
  return client.fetch(`*[_type == "blogPost" && slug.current == $slug][0]`, { slug })
}

export async function getRoarmdSections() {
  return client.fetch(`*[_type == "roarmdSection"] | order(order asc)`)
}

export async function getRoarmdPage() {
  return client.fetch(`*[_type == "roarmdPage"][0]`)
}
