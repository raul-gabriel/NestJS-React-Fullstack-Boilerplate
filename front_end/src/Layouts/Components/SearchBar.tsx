import { Search, X } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const highlight = useCallback((text: string) => {
    removeHighlights()

    if (!text.trim()) return

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement
          if (!parent) return NodeFilter.FILTER_REJECT

          const tag = parent.tagName.toLowerCase()
          if (['script', 'style', 'noscript', 'input', 'textarea'].includes(tag))
            return NodeFilter.FILTER_REJECT

          if (parent.closest('[data-search-bar]'))
            return NodeFilter.FILTER_REJECT

          return node.textContent?.toLowerCase().includes(text.toLowerCase())
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT
        },
      }
    )

    const nodes: Text[] = []
    let currentNode: Node | null

    while ((currentNode = walker.nextNode())) {
      nodes.push(currentNode as Text)
    }

    let firstMatch: HTMLElement | null = null

    for (const textNode of nodes) {
      const parent = textNode.parentElement
      if (!parent) continue

      const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`(${escaped})`, 'gi')

      const content = textNode.textContent
      if (!content) continue

      const parts = content.split(regex)
      if (parts.length <= 1) continue

      const frag = document.createDocumentFragment()

      for (const part of parts) {
        if (regex.test(part)) {
          const mark = document.createElement('mark')
          mark.className = 'search-highlight'
          mark.textContent = part
          mark.style.cssText =
            'background:#fde047;color:#1a1a1a;border-radius:2px;padding:0 1px;'

          frag.appendChild(mark)

          if (!firstMatch) {
            firstMatch = mark
          }
        } else {
          frag.appendChild(document.createTextNode(part))
        }

        regex.lastIndex = 0
      }

      parent.replaceChild(frag, textNode)
    }

    // ✅ ahora NO da error
    if (firstMatch) {
      firstMatch.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [])
  const removeHighlights = () => {
    document.querySelectorAll('mark.search-highlight').forEach(mark => {
      const parent = mark.parentNode
      if (!parent) return
      parent.replaceChild(document.createTextNode(mark.textContent || ''), mark)
      parent.normalize()
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') highlight(query)
    if (e.key === 'Escape') {
      setQuery('')
      removeHighlights()
      inputRef.current?.blur()
    }
  }

  const handleClear = () => {
    setQuery('')
    removeHighlights()
    inputRef.current?.focus()
  }

  return (
    <div className="relative hidden md:block" data-search-bar>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); if (!e.target.value) removeHighlights() }}
        onKeyDown={handleKeyDown}
        placeholder="Buscar en la página..."
        className="
          pl-9 pr-8 py-2 w-56 text-[13px] bg-white
          border border-gray-200 rounded-xl outline-none
          placeholder:text-gray-400 text-gray-700
          transition-all duration-150
          hover:border-gray-300
          focus:border-primary-500 focus:ring-3 focus:ring-primary-500/20
        "
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}