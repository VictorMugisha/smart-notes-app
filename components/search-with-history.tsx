"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSearchStore } from "@/lib/stores/search-store"
import { useUIStore } from "@/lib/stores/ui-store"
import { Search, Clock, X, Trash2 } from "lucide-react"

export function SearchWithHistory() {
  const { searchQuery, setSearchQuery } = useUIStore()
  const { recentSearches, addToSearchHistory, removeFromSearchHistory, clearSearchHistory } = useSearchStore()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      addToSearchHistory(query.trim())
    }
    setIsHistoryOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery)
    } else if (e.key === "Escape") {
      setIsHistoryOpen(false)
      inputRef.current?.blur()
    }
  }

  const showHistory = (isFocused || isHistoryOpen) && recentSearches.length > 0

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search notes, content, and labels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true)
            if (recentSearches.length > 0) {
              setIsHistoryOpen(true)
            }
          }}
          onBlur={() => {
            setIsFocused(false)
            // Delay closing to allow clicking on history items
            setTimeout(() => setIsHistoryOpen(false), 200)
          }}
          className="pl-9 pr-8"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search History Dropdown */}
      {showHistory && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-md">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Recent Searches</span>
              <Button variant="ghost" size="sm" onClick={clearSearchHistory} className="h-6 px-2 text-xs">
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
            <ScrollArea className="max-h-40">
              <div className="space-y-1">
                {recentSearches.map((query, index) => (
                  <div key={index} className="flex items-center justify-between group hover:bg-accent rounded-sm">
                    <button
                      className="flex items-center gap-2 p-2 text-sm text-left flex-1 min-w-0"
                      onClick={() => handleSearch(query)}
                    >
                      <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="truncate">{query}</span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromSearchHistory(query)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  )
}
