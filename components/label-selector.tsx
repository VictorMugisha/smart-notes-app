"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLabelsStore } from "@/lib/stores/labels-store"
import { useNotesStore } from "@/lib/stores/notes-store"
import { LabelManager } from "@/components/label-manager"
import { Tag, Plus } from "lucide-react"

interface LabelSelectorProps {
  noteId: string
  trigger?: React.ReactNode
}

export function LabelSelector({ noteId, trigger }: LabelSelectorProps) {
  const { labels, getLabelsByIds } = useLabelsStore()
  const { getNoteById, updateNote } = useNotesStore()
  const [isOpen, setIsOpen] = useState(false)

  const note = getNoteById(noteId)
  if (!note) return null

  const noteLabels = getLabelsByIds(note.labelIds)

  const handleLabelToggle = (labelId: string) => {
    const currentLabelIds = note.labelIds
    const newLabelIds = currentLabelIds.includes(labelId)
      ? currentLabelIds.filter((id) => id !== labelId)
      : [...currentLabelIds, labelId]

    updateNote(noteId, { labelIds: newLabelIds })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Tag className="h-4 w-4" />
            Labels ({noteLabels.length})
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Note Labels</h4>
            <LabelManager
              trigger={
                <Button variant="ghost" size="sm" className="gap-1">
                  <Plus className="h-3 w-3" />
                  New
                </Button>
              }
            />
          </div>

          {/* Current Labels */}
          {noteLabels.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm text-muted-foreground">Current Labels</h5>
              <div className="flex flex-wrap gap-1">
                {noteLabels.map((label) => (
                  <Badge
                    key={label.id}
                    variant="secondary"
                    className="cursor-pointer"
                    style={{ backgroundColor: `${label.color}20`, color: label.color }}
                    onClick={() => handleLabelToggle(label.id)}
                  >
                    <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: label.color }} />
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available Labels */}
          <div className="space-y-2">
            <h5 className="text-sm text-muted-foreground">Available Labels</h5>
            {labels.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No labels available. Create your first label to get started.
              </p>
            ) : (
              <ScrollArea className="max-h-40">
                <div className="space-y-2">
                  {labels.map((label) => (
                    <div key={label.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={label.id}
                        checked={note.labelIds.includes(label.id)}
                        onCheckedChange={() => handleLabelToggle(label.id)}
                      />
                      <label htmlFor={label.id} className="flex items-center gap-2 cursor-pointer flex-1 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: label.color }} />
                        {label.name}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
