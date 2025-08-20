"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLabelsStore } from "@/lib/stores/labels-store"
import { useUIStore } from "@/lib/stores/ui-store"
import { useNotesStore } from "@/lib/stores/notes-store"
import { cn } from "@/lib/utils"
import { Tag, X } from "lucide-react"

export function LabelFilter() {
  const { labels } = useLabelsStore()
  const { selectedLabelIds, toggleLabelFilter, setSelectedLabelIds } = useUIStore()
  const { notes } = useNotesStore()

  const getLabelNoteCount = (labelId: string) => {
    return notes.filter((note) => note.labelIds.includes(labelId)).length
  }

  const clearAllFilters = () => {
    setSelectedLabelIds([])
  }

  if (labels.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Tag className="h-6 w-6 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No labels created yet</p>
      </div>
    )
  }

  return (
    <div className="p-4 border-b border-sidebar-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Filter by Labels
        </h3>
        {selectedLabelIds.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="max-h-40">
        <div className="space-y-1">
          {labels.map((label) => {
            const noteCount = getLabelNoteCount(label.id)
            const isSelected = selectedLabelIds.includes(label.id)

            return (
              <button
                key={label.id}
                onClick={() => toggleLabelFilter(label.id)}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-md transition-colors text-left",
                  "hover:bg-sidebar-accent/50",
                  isSelected && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: label.color }} />
                  <span className="text-sm truncate">{label.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {noteCount}
                </Badge>
              </button>
            )
          })}
        </div>
      </ScrollArea>

      {/* Active Filters */}
      {selectedLabelIds.length > 0 && (
        <div className="mt-3 pt-3 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-1">
            {selectedLabelIds.map((labelId) => {
              const label = labels.find((l) => l.id === labelId)
              if (!label) return null

              return (
                <Badge
                  key={labelId}
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  style={{ backgroundColor: `${label.color}20`, color: label.color }}
                  onClick={() => toggleLabelFilter(labelId)}
                >
                  {label.name}
                  <X className="h-2 w-2 ml-1" />
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
