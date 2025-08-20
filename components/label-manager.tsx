"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLabelsStore, defaultColors } from "@/lib/stores/labels-store"
import { useNotesStore } from "@/lib/stores/notes-store"
import { cn } from "@/lib/utils"
import { Plus, Edit2, Trash2, Tag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LabelManagerProps {
  trigger?: React.ReactNode
}

export function LabelManager({ trigger }: LabelManagerProps) {
  const { labels, createLabel, updateLabel, deleteLabel } = useLabelsStore()
  const { notes } = useNotesStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingLabel, setEditingLabel] = useState<string | null>(null)
  const [newLabelName, setNewLabelName] = useState("")
  const [newLabelColor, setNewLabelColor] = useState(defaultColors[0])
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState("")

  const getLabelNoteCount = (labelId: string) => {
    return notes.filter((note) => note.labelIds.includes(labelId)).length
  }

  const handleCreateLabel = () => {
    if (newLabelName.trim()) {
      createLabel(newLabelName.trim(), newLabelColor)
      setNewLabelName("")
      setNewLabelColor(defaultColors[0])
    }
  }

  const handleEditLabel = (labelId: string) => {
    const label = labels.find((l) => l.id === labelId)
    if (label) {
      setEditingLabel(labelId)
      setEditName(label.name)
      setEditColor(label.color)
    }
  }

  const handleSaveEdit = () => {
    if (editingLabel && editName.trim()) {
      updateLabel(editingLabel, { name: editName.trim(), color: editColor })
      setEditingLabel(null)
      setEditName("")
      setEditColor("")
    }
  }

  const handleCancelEdit = () => {
    setEditingLabel(null)
    setEditName("")
    setEditColor("")
  }

  const handleDeleteLabel = (labelId: string) => {
    const noteCount = getLabelNoteCount(labelId)
    const confirmMessage =
      noteCount > 0
        ? `Delete this label? It will be removed from ${noteCount} note${noteCount === 1 ? "" : "s"}.`
        : "Delete this label?"

    if (confirm(confirmMessage)) {
      deleteLabel(labelId)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Tag className="h-4 w-4" />
            Manage Labels
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Manage Labels
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create New Label */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Create New Label</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Label name..."
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateLabel()}
                className="flex-1"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: newLabelColor }} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="grid grid-cols-4 gap-1 p-2">
                    {defaultColors.map((color) => (
                      <button
                        key={color}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-all",
                          newLabelColor === color ? "border-foreground scale-110" : "border-transparent",
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewLabelColor(color)}
                      />
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleCreateLabel} disabled={!newLabelName.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Existing Labels */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Existing Labels ({labels.length})</h4>
            <ScrollArea className="max-h-60">
              <div className="space-y-2">
                {labels.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No labels created yet</p>
                ) : (
                  labels.map((label) => (
                    <div key={label.id} className="flex items-center gap-2 p-2 rounded-lg border">
                      {editingLabel === label.id ? (
                        <>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit()
                              if (e.key === "Escape") handleCancelEdit()
                            }}
                            className="flex-1"
                            autoFocus
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: editColor }} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <div className="grid grid-cols-4 gap-1 p-2">
                                {defaultColors.map((color) => (
                                  <button
                                    key={color}
                                    className={cn(
                                      "w-6 h-6 rounded-full border-2 transition-all",
                                      editColor === color ? "border-foreground scale-110" : "border-transparent",
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setEditColor(color)}
                                  />
                                ))}
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button size="sm" onClick={handleSaveEdit}>
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Badge
                            variant="secondary"
                            className="flex-1 justify-start"
                            style={{ backgroundColor: `${label.color}20`, color: label.color }}
                          >
                            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: label.color }} />
                            {label.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{getLabelNoteCount(label.id)}</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditLabel(label.id)}>
                                <Edit2 className="h-3 w-3 mr-2" />
                                Edit Label
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteLabel(label.id)} variant="destructive">
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete Label
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
