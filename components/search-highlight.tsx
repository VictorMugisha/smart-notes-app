"use client"

interface SearchHighlightProps {
  text: string
  searchTerm: string
  className?: string
}

export function SearchHighlight({ text, searchTerm, className }: SearchHighlightProps) {
  if (!searchTerm.trim()) {
    return <span className={className}>{text}</span>
  }

  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi")
  const parts = text.split(regex)

  return (
    <span className={className}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  )
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
