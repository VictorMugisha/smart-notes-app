"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchWithHistory } from "@/components/search-with-history"
import { useUIStore } from "@/lib/stores/ui-store"
import { useNotesStore } from "@/lib/stores/notes-store"
import { SortAsc, SortDesc, X } from "lucide-react"

export function NotesHeader() {
  const { searchQuery, sortBy, setSortBy, sortOrder, setSortOrder, selectedLabelIds, clearFilters } = useUIStore()
  const { notes } = useNotesStore()

  const hasActiveFilters = searchQuery || selectedLabelIds.length > 0

  return (
    <div className="p-4 border-b border-sidebar-border space-y-3">
      {/* Search */}
      <SearchWithHistory />

      {/* Sort and Filter Controls */}
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={(value: "created" | "updated" | "title") => setSortBy(value)}>
          <SelectTrigger className="w-[120px]" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Last Modified</SelectItem>
            <SelectItem value="created">Date Created</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
          className="h-8 w-8"
        >
          {sortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto text-xs">
            <X className="h-3 w-3 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Notes Count */}
      <div className="text-xs text-muted-foreground">
        {notes.length} {notes.length === 1 ? "note" : "notes"}
        {hasActiveFilters && " (filtered)"}
      </div>
    </div>
  )
}
