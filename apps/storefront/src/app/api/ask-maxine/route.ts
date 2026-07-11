import { anthropic } from "@ai-sdk/anthropic"
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  UIMessage,
} from "ai"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"

const MAXINE_SYSTEM = `You are Maxine, the warm and knowledgeable wellness guide for Acme Wellness, a premium wellness storefront.

Guidelines:
- Be caring, encouraging, and concise — a few short sentences or a small list is usually enough.
- Help visitors explore wellness goals (energy, sleep, stress, hormones, recovery) and connect them to relevant Acme Wellness products from the catalog below when it genuinely helps.
- When you mention a product, use its exact title so the visitor can find it in the store.
- You are not a medical professional: never diagnose, and for medical concerns gently suggest speaking with a licensed clinician.
- If you don't know something, say so honestly.`

type CatalogItem = { title: string; price: string | null; handle: string }

const loadCatalog = async (countryCode?: string): Promise<CatalogItem[]> => {
  try {
    const { response } = await listProducts({
      countryCode:
        countryCode || process.env.NEXT_PUBLIC_DEFAULT_REGION || "us",
      queryParams: { limit: 12 },
    })
    return response.products.map((product) => {
      const { cheapestPrice } = getProductPrice({ product })
      return {
        title: product.title ?? "",
        price: cheapestPrice?.calculated_price ?? null,
        handle: product.handle ?? "",
      }
    })
  } catch (e) {
    console.error("[ask-maxine] failed to load product catalog:", e)
    return []
  }
}

/* ------------------------------- demo mode ------------------------------- */

const productLine = (item: CatalogItem) =>
  item.price ? `${item.title} (from ${item.price})` : item.title

const demoReply = (userText: string, catalog: CatalogItem[]): string => {
  const text = userText.toLowerCase()
  const picks = catalog.slice(0, 2).map(productLine)
  const suggestion = picks.length
    ? `From our current collection, I'd start with ${picks.join(" or ")} — both are customer favorites.`
    : `Once you're browsing our Products page, I can point you to a good starting place.`

  if (/\b(hi|hello|hey|good (morning|afternoon|evening))\b/.test(text)) {
    return `Hello! I'm Maxine, your wellness guide here at Acme Wellness. I can help with sleep, energy, stress, hormones, or finding the right product for your routine. What's on your mind today?`
  }
  if (/sleep|insomnia|tired at night|rest/.test(text)) {
    return `Restful sleep is such a great goal to focus on. A consistent wind-down routine — dim lights, no screens for the last 30 minutes, and a cool room — makes a real difference for most people.\n\n${suggestion}\n\nIf sleep trouble persists for weeks, it's worth mentioning to a clinician too.`
  }
  if (/energy|fatigue|exhaust|sluggish/.test(text)) {
    return `Low energy usually traces back to sleep, hydration, movement, or nutrition — small consistent habits beat big overhauls. A 10-minute morning walk in daylight is my favorite starting point.\n\n${suggestion}`
  }
  if (/stress|anxiet|overwhelm|burnout/.test(text)) {
    return `I hear you — stress has a way of touching everything else. Breathwork (try 4 counts in, 6 counts out for two minutes) is a simple, evidence-friendly reset you can do anywhere.\n\n${suggestion}\n\nAnd if it ever feels like more than everyday stress, a licensed professional is the right ally.`
  }
  if (/product|recommend|price|buy|shop|catalog/.test(text)) {
    return picks.length
      ? `Happy to help you shop! ${suggestion} You can tap any product above the message box to explore, or tell me your wellness goal and I'll narrow it down.`
      : `Happy to help you shop! Browse our Products page for the full collection, or tell me your wellness goal and I'll narrow it down.`
  }
  return `Thank you for sharing that with me. I want to make sure we explore this thoroughly and give you the most personalized guidance possible. Could you tell me a bit more about when you first noticed this, and whether it's been affecting your sleep or energy levels? That context helps me a great deal.`
}

const streamDemoReply = (reply: string) => {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const id = "maxine-demo"
      writer.write({ type: "start" })
      writer.write({ type: "text-start", id })
      // Stream word by word so the demo feels like a live model response.
      for (const word of reply.split(/(?<=\s)/)) {
        writer.write({ type: "text-delta", id, delta: word })
        await new Promise((resolve) => setTimeout(resolve, 30))
      }
      writer.write({ type: "text-end", id })
      writer.write({ type: "finish" })
    },
  })
  return createUIMessageStreamResponse({
    stream,
    headers: { "x-maxine-mode": "demo" },
  })
}

/* --------------------------------- route --------------------------------- */

export async function POST(req: Request) {
  let messages: UIMessage[]
  let countryCode: string | undefined
  try {
    ;({ messages, countryCode } = await req.json())
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("messages missing")
    }
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 })
  }

  const catalog = await loadCatalog(countryCode)

  // Demo mode: no API key configured (or explicitly forced). Streams canned
  // Maxine replies so the page is fully demoable without Claude access.
  const demoMode =
    !process.env.ANTHROPIC_API_KEY || process.env.MAXINE_DEMO_MODE === "true"

  if (demoMode) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user")
    const lastText = (lastUser?.parts ?? [])
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ")
    return streamDemoReply(demoReply(lastText, catalog))
  }

  const catalogText = catalog
    .map(
      (item) =>
        `- ${item.title}${item.price ? ` — from ${item.price}` : ""} (page: /products/${item.handle})`
    )
    .join("\n")
  const system = catalogText
    ? `${MAXINE_SYSTEM}\n\nCurrent product catalog:\n${catalogText}`
    : MAXINE_SYSTEM

  try {
    const result = streamText({
      model: anthropic(process.env.MAXINE_MODEL || "claude-opus-4-8"),
      system,
      messages: await convertToModelMessages(messages),
      onError: ({ error }) => {
        // Mid-stream model/network failures land here; the client gets an
        // error part via onError below.
        console.error("[ask-maxine] stream error:", error)
      },
    })

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("[ask-maxine] response error:", error)
        return "Maxine is having trouble responding right now."
      },
    })
  } catch (e) {
    // Errors thrown before streaming starts (bad model id, auth failure, etc.)
    console.error("[ask-maxine] request failed:", e)
    return Response.json(
      { error: "Maxine is having trouble responding right now." },
      { status: 500 }
    )
  }
}
