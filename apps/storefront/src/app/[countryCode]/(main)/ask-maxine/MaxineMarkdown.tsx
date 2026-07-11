"use client"

import { AnchorHTMLAttributes } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const MarkdownLink = ({
  href,
  children,
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const className =
    "text-deep-purple font-medium underline underline-offset-2 hover:opacity-80"
  if (href?.startsWith("/")) {
    return (
      <LocalizedClientLink href={href} className={className}>
        {children}
      </LocalizedClientLink>
    )
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  )
}

const MaxineMarkdown = ({ text }: { text: string }) => {
  return (
    <div className="[&>*+*]:mt-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: MarkdownLink,
          strong: ({ children }) => (
            <strong className="font-semibold text-grey-90">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-1">{children}</ol>
          ),
          h1: ({ children }) => (
            <p className="font-semibold text-grey-90">{children}</p>
          ),
          h2: ({ children }) => (
            <p className="font-semibold text-grey-90">{children}</p>
          ),
          h3: ({ children }) => (
            <p className="font-semibold text-grey-90">{children}</p>
          ),
          code: ({ children }) => (
            <code className="bg-light-pink rounded px-1 py-0.5 text-xs">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-coral pl-3 text-grey-60">
              {children}
            </blockquote>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

export default MaxineMarkdown
