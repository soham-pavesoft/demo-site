import { defineType, defineField } from "sanity"

export default defineType({
  name: "roarmdPage",
  title: "RoarMD Advantage Page",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "text", rows: 3 }),
    defineField({ name: "heroImage", title: "Hero Background Image", type: "image", options: { hotspot: true } }),
  ],
})
