"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { SearchHighlight } from "@/components/search-highlight"
import { useNotesStore } from "@/lib/stores/notes-store"
import { useLabelsStore } from "@/lib/stores/labels-store"
import { useUIStore } from "@/lib/stores/ui-store"
import { cn } from "@/lib/utils"
import { FileText, Trash2, Tag, MoreHorizontal, Calendar, Clock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NotesListProps {
  filteredNotes: ReturnType<typeof useNotesStore>["notes"]
}

export function NotesList({ filteredNotes }: NotesListProps) {
  const { currentNoteId, setCurrentNote, deleteNote, duplicateNote } = useNotesStore()
  const { getLabelsByIds } = useLabelsStore()
  const { sortBy, sortOrder, searchQuery } = useUIStore()
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set())
  const [bulkMode, setBulkMode] = useState(false)

  // Sort notes based on current sort settings
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "title":
        comparison = a.title.localeCompare(b.title)
        break
      case "created":
        comparison = a.createdAt - b.createdAt
        break
      case "updated":
      default:
        comparison = a.updatedAt - b.updatedAt
        break
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  const handleNoteSelect = (noteId: string) => {
    if (bulkMode) {
      const newSelected = new Set(selectedNotes)
      if (newSelected.has(noteId)) {
        newSelected.delete(noteId)
      } else {
        newSelected.add(noteId)
      }
      setSelectedNotes(newSelected)
    } else {
      setCurrentNote(noteId)
    }
  }

  const handleBulkDelete = () => {
    if (selectedNotes.size > 0 && confirm(`Delete ${selectedNotes.size} selected notes?`)) {
      selectedNotes.forEach((noteId) => deleteNote(noteId))
      setSelectedNotes(new Set())
      setBulkMode(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedNotes.size === sortedNotes.length) {
      setSelectedNotes(new Set())
    } else {
      setSelectedNotes(new Set(sortedNotes.map((note) => note.id)))
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  if (sortedNotes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No notes found</p>
        <p className="text-xs mt-1">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Bulk Actions Header */}
      {bulkMode && (
        <div className="p-3 border-b border-sidebar-border bg-sidebar-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox checked={selectedNotes.size === sortedNotes.length} onCheckedChange={handleSelectAll} />
              <span className="text-sm font-medium">
                {selectedNotes.size} of {sortedNotes.length} selected
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={selectedNotes.size === 0}>
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setBulkMode(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="space-y-2">
            {sortedNotes.map((note) => {
              const noteLabels = getLabelsByIds(note.labelIds)
              const isSelected = selectedNotes.has(note.id)
              const isCurrent = currentNoteId === note.id

              return (
                <div
                  key={note.id}
                  className={cn(
                    "group relative rounded-lg transition-all duration-200 border",
                    "border-border/50 bg-card/30 backdrop-blur-sm",
                    "hover:bg-card/60 hover:border-border hover:shadow-sm",
                    "dark:border-border/30 dark:bg-card/20",
                    "dark:hover:bg-card/40 dark:hover:border-border/60",
                    isCurrent && !bulkMode ? "bg-primary/10 border-primary/30 shadow-sm ring-1 ring-primary/20" : "",
                    isSelected && "bg-primary/5 ring-1 ring-primary/30 border-primary/40",
                  )}
                >
                  <div className="flex items-start gap-3 p-3 cursor-pointer" onClick={() => handleNoteSelect(note.id)}>
                    {/* Selection Checkbox */}
                    {bulkMode && (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleNoteSelect(note.id)}
                        className="mt-1"
                      />
                    )}

                    {/* Note Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title with Search Highlighting */}
                      <div className="font-medium text-sm line-clamp-1 mb-2">
                        <SearchHighlight text={note.title || "Untitled Note"} searchTerm={searchQuery} />
                      </div>

                      {/* Labels */}
                      {noteLabels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {noteLabels.slice(0, 3).map((label) => (
                            <Badge
                              key={label.id}
                              variant="secondary"
                              className="text-xs px-1.5 py-0.5 h-auto"
                              style={{ backgroundColor: `${label.color}20`, color: label.color }}
                            >
                              <SearchHighlight text={label.name} searchTerm={searchQuery} />
                            </Badge>
                          ))}
                          {noteLabels.length > 3 && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-auto">
                              +{noteLabels.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(note.updatedAt)}
                          </div>
                          {note.createdAt !== note.updatedAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(note.createdAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    {!bulkMode && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => duplicateNote(note.id)}>Duplicate Note</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setCurrentNote(note.id)}>
                            <Tag className="h-3 w-3 mr-2" />
                            Manage Labels
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => deleteNote(note.id)} variant="destructive">
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete Note
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>

      {/* Bulk Mode Toggle */}
      {!bulkMode && sortedNotes.length > 1 && (
        <div className="p-3 border-t border-sidebar-border">
          <Button variant="ghost" size="sm" onClick={() => setBulkMode(true)} className="w-full text-xs">
            Select Multiple Notes
          </Button>
        </div>
      )}
    </div>
  )
}
