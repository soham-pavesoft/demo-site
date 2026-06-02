import { defineType, defineField } from "sanity"

export default defineType({
  name: "roarmdSection",
  title: "RoarMD Advantage Section",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 2 }),
    defineField({ name: "icon", title: "Emoji Icon", type: "string" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
})
