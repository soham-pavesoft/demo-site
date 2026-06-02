import { defineType, defineField } from "sanity"

export default defineType({
  name: "heroBanner",
  title: "Hero Banner",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
    defineField({ name: "image", title: "Background Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "ctaText", title: "CTA Button Text", type: "string" }),
    defineField({ name: "ctaLink", title: "CTA Button Link", type: "string" }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
})
