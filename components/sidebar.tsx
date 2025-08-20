"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/lib/stores/ui-store"
import { useNotesStore } from "@/lib/stores/notes-store"
import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts"
import { NotesHeader } from "@/components/notes-header"
import { NotesList } from "@/components/notes-list"
import { LabelFilter } from "@/components/label-filter"
import { LabelManager } from "@/components/label-manager"
import { SettingsPanel } from "@/components/settings-panel"
import { PanelLeft, Plus, Sun, Moon, Settings } from "lucide-react"

export function Sidebar() {
  useKeyboardShortcuts()

  const { sidebarCollapsed, toggleSidebar, theme, toggleTheme, searchQuery, selectedLabelIds } = useUIStore()
  const { notes, createNote, setCurrentNote, searchNotes, getNotesWithLabels } = useNotesStore()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateNote = async () => {
    setIsCreating(true)
    const noteId = createNote()
    setCurrentNote(noteId)
    setIsCreating(false)
  }

  // Apply search and label filters
  let filteredNotes = notes

  if (searchQuery) {
    filteredNotes = searchNotes(searchQuery)
  }

  if (selectedLabelIds.length > 0) {
    filteredNotes = getNotesWithLabels(selectedLabelIds)
  }

  // If both search and labels are active, combine them
  if (searchQuery && selectedLabelIds.length > 0) {
    const searchResults = searchNotes(searchQuery)
    const labelResults = getNotesWithLabels(selectedLabelIds)
    filteredNotes = searchResults.filter((note) => labelResults.some((labelNote) => labelNote.id === note.id))
  }

  if (sidebarCollapsed) {
    return (
      <div className="flex flex-col items-center p-2 gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} title="Expand Sidebar">
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCreateNote} disabled={isCreating} title="New Note">
          <Plus className="h-4 w-4" />
        </Button>
        <LabelManager
          trigger={
            <Button variant="ghost" size="icon" title="Manage Labels">
              <Settings className="h-4 w-4" />
            </Button>
          }
        />
        <SettingsPanel />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <h1 className="text-lg font-serif font-bold text-sidebar-foreground">Smart Notes</h1>
        <div className="flex items-center gap-1">
          <SettingsPanel />
          <LabelManager
            trigger={
              <Button variant="ghost" size="icon" title="Manage Labels">
                <Settings className="h-4 w-4" />
              </Button>
            }
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} title="Collapse Sidebar">
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* New Note Button */}
      <div className="p-4 border-b border-sidebar-border">
        <Button onClick={handleCreateNote} disabled={isCreating} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <NotesHeader />

      <LabelFilter />

      {/* Notes List */}
      <div className="flex-1 min-h-0">
        <NotesList filteredNotes={filteredNotes} />
      </div>
    </div>
  )
}
