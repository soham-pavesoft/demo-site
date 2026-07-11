"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { FormEvent, useEffect, useRef, useState } from "react"
import { FiArrowUp } from "react-icons/fi"
import ProductCarousel, { MaxineProduct } from "./ProductCarousel"

const MaxineAvatar = () => (
  <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-coral to-deep-purple flex items-center justify-center text-white text-sm font-serif italic">
    M
  </div>
)

const AskMaxineChat = ({
  products,
  countryCode,
}: {
  products: MaxineProduct[]
  countryCode: string
}) => {
  const [input, setInput] = useState("")
  const [showCarousel, setShowCarousel] = useState(false)
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ask-maxine",
      body: { countryCode },
    }),
  })

  const busy = status === "submitted" || status === "streaming"

  useEffect(() => {
    // Scroll only the message list, never the page (scrollIntoView would
    // also scroll the document and drag the footer into view).
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages, status])

  useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current)
    }
  }, [])

  const revealCarousel = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
    setShowCarousel(true)
  }

  const concealCarousel = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
    hideTimeout.current = setTimeout(() => setShowCarousel(false), 250)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    sendMessage({ text })
    setInput("")
  }

  const messageText = (parts: (typeof messages)[number]["parts"]) =>
    parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("")

  return (
    <div className="bg-cream flex flex-col h-[calc(100vh-4rem)]">
      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-6 py-10">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center pt-24">
              <h1 className="text-4xl md:text-5xl font-serif italic text-grey-90">
                Ask Maxine <span className="text-coral">anything</span>
              </h1>
              <p className="mt-4 text-grey-60 max-w-md">
                Your personal wellness guide. Ask about sleep, energy,
                hormones, or which of our products fits your routine.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {messages.map((message) =>
                message.role === "user" ? (
                  <div key={message.id} className="flex justify-end">
                    <div className="max-w-[80%] bg-deep-purple text-white rounded-2xl rounded-br-md px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap">
                      {messageText(message.parts)}
                    </div>
                  </div>
                ) : (
                  <div key={message.id} className="flex gap-3">
                    <MaxineAvatar />
                    <div className="max-w-[80%] bg-white border border-grey-20 text-grey-90 rounded-2xl rounded-bl-md px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
                      {messageText(message.parts)}
                    </div>
                  </div>
                )
              )}
              {status === "submitted" && (
                <div className="flex gap-3">
                  <MaxineAvatar />
                  <div className="bg-white border border-grey-20 rounded-2xl rounded-bl-md px-5 py-4 shadow-sm flex gap-1.5 items-center">
                    <span className="w-2 h-2 rounded-full bg-coral animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-coral animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-coral animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              {error && (
                <div className="flex gap-3">
                  <MaxineAvatar />
                  <div className="max-w-[80%] bg-light-pink border border-coral/30 text-grey-90 rounded-2xl rounded-bl-md px-5 py-3 text-sm leading-relaxed">
                    {typeof navigator !== "undefined" && !navigator.onLine
                      ? "It looks like you're offline. Check your connection and try again."
                      : "I'm having trouble responding right now. Please try again in a moment."}
                    <button
                      type="button"
                      onClick={() => regenerate()}
                      className="block mt-2 text-deep-purple font-medium underline underline-offset-2 hover:opacity-80"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="w-full max-w-3xl mx-auto px-6 pb-8">
        <div
          className="relative"
          onMouseEnter={revealCarousel}
          onMouseLeave={concealCarousel}
        >
          {products.length > 0 && (
            <div
              className={`absolute bottom-full inset-x-0 mb-4 transition-all duration-200 ${
                showCarousel
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              <ProductCarousel products={products} />
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-white border border-grey-20 rounded-full shadow-sm pl-6 pr-2 py-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={revealCarousel}
              onBlur={concealCarousel}
              placeholder="Ask Maxine anything..."
              className="flex-1 bg-transparent outline-none text-sm text-grey-90 placeholder:text-grey-40"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={busy || !input.trim()}
              className="w-9 h-9 shrink-0 rounded-full bg-deep-purple text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <FiArrowUp />
            </button>
          </form>
        </div>
        <p className="mt-3 text-center text-xs text-grey-40">
          ✦ Maxine knows our full product catalog and wellness essentials
        </p>
      </div>
    </div>
  )
}

export default AskMaxineChat
