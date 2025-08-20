"use client"

import { useEffect } from "react"
import { useNotesStore } from "@/lib/stores/notes-store"
import { useUIStore } from "@/lib/stores/ui-store"

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: (e?: KeyboardEvent) => void
  description: string
}

export function useKeyboardShortcuts() {
  const { createNote, setCurrentNote, deleteNote, currentNoteId, duplicateNote } = useNotesStore()
  const { toggleSidebar, toggleTheme, setSearchQuery, searchQuery } = useUIStore()

  const shortcuts: KeyboardShortcut[] = [
    {
      key: "n",
      ctrlKey: true,
      action: () => {
        const noteId = createNote()
        setCurrentNote(noteId)
      },
      description: "Create new note",
    },
    {
      key: "d",
      ctrlKey: true,
      action: () => {
        if (currentNoteId) {
          duplicateNote(currentNoteId)
        }
      },
      description: "Duplicate current note",
    },
    {
      key: "Delete",
      ctrlKey: true,
      action: () => {
        if (currentNoteId && confirm("Delete this note?")) {
          deleteNote(currentNoteId)
        }
      },
      description: "Delete current note",
    },
    {
      key: "k",
      ctrlKey: true,
      action: () => {
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
      },
      description: "Focus search",
    },
    {
      key: "\\",
      ctrlKey: true,
      action: toggleSidebar,
      description: "Toggle sidebar",
    },
    {
      key: "t",
      ctrlKey: true,
      shiftKey: true,
      action: toggleTheme,
      description: "Toggle theme",
    },
    {
      key: "Escape",
      action: () => {
        if (searchQuery) {
          setSearchQuery("")
        }
        // Remove focus from any active element
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      },
      description: "Clear search / Remove focus",
    },
    {
      key: "s",
      ctrlKey: true,
      action: (e) => {
        e?.preventDefault()
        // Save is automatic, but we can show a toast or something
        console.log("Notes are auto-saved!")
      },
      description: "Save (auto-saved)",
    },
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs (except for specific cases)
      const target = event.target as HTMLElement
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        target.isContentEditable

      for (const shortcut of shortcuts) {
        const ctrlOrMeta = shortcut.ctrlKey || shortcut.metaKey
        const matchesModifiers =
          (!ctrlOrMeta || event.ctrlKey || event.metaKey) &&
          (!shortcut.shiftKey || event.shiftKey) &&
          (!shortcut.altKey || event.altKey)

        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase()

        if (matchesKey && matchesModifiers) {
          // Allow certain shortcuts even in inputs
          const allowInInput = ["Escape", "k"].includes(shortcut.key)

          if (!isInput || allowInInput) {
            event.preventDefault()
            shortcut.action(event)
            break
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, []) // Removed shortcuts from the dependency array

  return { shortcuts }
}
