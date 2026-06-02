import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import { projectId, dataset, apiVersion } from "./env"

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
