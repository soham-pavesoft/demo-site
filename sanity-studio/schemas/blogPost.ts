import { defineType, defineField } from "sanity"

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Cover Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
  ],
})
