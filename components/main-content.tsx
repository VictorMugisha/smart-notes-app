"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/rich-text-editor"
import { LabelSelector } from "@/components/label-selector"
import { WelcomeEmpty } from "@/components/empty-states"
import { LoadingOverlay } from "@/components/loading-states"
import { useNotesStore } from "@/lib/stores/notes-store"
import { useUIStore } from "@/lib/stores/ui-store"
import { Trash2, Copy, MoreHorizontal, Tag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function MainContent() {
  const {
    currentNoteId,
    getNoteById,
    updateNote,
    deleteNote,
    duplicateNote,
    hasUnsavedChanges,
    setUnsavedChanges,
    createNote,
    setCurrentNote,
  } = useNotesStore()
  const { sidebarCollapsed } = useUIStore()
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const currentNote = currentNoteId ? getNoteById(currentNoteId) : null

  // Update local state when current note changes
  useEffect(() => {
    if (currentNote) {
      setNoteTitle(currentNote.title)
      setNoteContent(currentNote.content)
    } else {
      setNoteTitle("")
      setNoteContent("")
    }
  }, [currentNote])

  // Save title changes
  const handleTitleChange = (newTitle: string) => {
    setNoteTitle(newTitle)
    if (currentNoteId && newTitle !== currentNote?.title) {
      updateNote(currentNoteId, { title: newTitle })
    }
  }

  // Save content changes
  const handleContentChange = (newContent: string) => {
    setNoteContent(newContent)
    if (currentNoteId && newContent !== currentNote?.content) {
      updateNote(currentNoteId, { content: newContent })
    }
  }

  // Handle note actions
  const handleDeleteNote = async () => {
    if (currentNoteId && confirm("Are you sure you want to delete this note?")) {
      setIsLoading(true)
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 300))
      deleteNote(currentNoteId)
      setIsLoading(false)
    }
  }

  const handleDuplicateNote = async () => {
    if (currentNoteId) {
      setIsLoading(true)
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 300))
      const newNoteId = duplicateNote(currentNoteId)
      setIsLoading(false)
    }
  }

  const handleCloseNote = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to close this note?")) {
        setCurrentNote(null)
      }
    } else {
      setCurrentNote(null)
    }
  }

  const handleCreateNote = () => {
    const noteId = createNote()
    setCurrentNote(noteId)
  }

  if (!currentNote) {
    return <WelcomeEmpty onCreateNote={handleCreateNote} />
  }

  return (
    <LoadingOverlay isLoading={isLoading} loadingText="Processing...">
      <div className="flex-1 flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
          <div className="flex-1 max-w-2xl">
            <Input
              value={noteTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Note title..."
              className="text-lg font-serif font-semibold border-none bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                Saving...
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={handleCloseNote} title="Close Note">
              ✕
            </Button>

            <LabelSelector
              noteId={currentNote.id}
              trigger={
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Tag className="h-4 w-4" />
                  <span className="mobile-hidden">Labels</span>
                </Button>
              }
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDuplicateNote}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Note
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteNote} variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4">
          <RichTextEditor
            content={noteContent}
            onChange={handleContentChange}
            onUnsavedChanges={setUnsavedChanges}
            placeholder="Start writing your note..."
            className="h-full"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="mobile-hidden">Created: {new Date(currentNote.createdAt).toLocaleString()}</div>
            <div>Last modified: {new Date(currentNote.updatedAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  )
}
