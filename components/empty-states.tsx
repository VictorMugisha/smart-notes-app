"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { FileText, Search, Tag, Plus, Lightbulb } from "lucide-react"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="mb-4 opacity-50">{icon}</div>
      <h3 className="text-lg font-serif font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="gap-2">
          <Plus className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  )
}

export function NoNotesEmpty({ onCreateNote }: { onCreateNote: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="h-16 w-16 mx-auto" />}
      title="Welcome to Smart Notes"
      description="Start organizing your thoughts with rich text notes, labels, and powerful search. Create your first note to begin your journey."
      action={{
        label: "Create Your First Note",
        onClick: onCreateNote,
      }}
    />
  )
}

export function NoSearchResultsEmpty({
  searchQuery,
  onClearSearch,
}: { searchQuery: string; onClearSearch: () => void }) {
  return (
    <div className="text-center py-12 px-4">
      <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-serif font-semibold mb-2">No notes found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
        We couldn't find any notes matching "{searchQuery}". Try adjusting your search terms or filters.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button variant="outline" onClick={onClearSearch}>
          Clear Search
        </Button>
      </div>
    </div>
  )
}

export function NoLabelsEmpty({ onCreateLabel }: { onCreateLabel: () => void }) {
  return (
    <EmptyState
      icon={<Tag className="h-12 w-12 mx-auto" />}
      title="No labels yet"
      description="Create labels to organize and categorize your notes for better organization and quick filtering."
      action={{
        label: "Create First Label",
        onClick: onCreateLabel,
      }}
    />
  )
}

export function WelcomeEmpty({ onCreateNote }: { onCreateNote: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="relative">
            <FileText className="h-20 w-20 mx-auto text-primary/20" />
            <Lightbulb className="h-8 w-8 absolute -top-2 -right-2 text-yellow-500" />
          </div>
        </div>
        <h2 className="text-2xl font-serif font-bold mb-3">Ready to capture your ideas?</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Select a note from the sidebar to start editing, or create a new note to begin writing your thoughts.
        </p>
        <div className="space-y-3">
          <Button onClick={onCreateNote} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create New Note
          </Button>
          <div className="text-xs text-muted-foreground">
            <p>💡 Tip: Use Ctrl+B for bold, Ctrl+I for italic</p>
          </div>
        </div>
      </div>
    </div>
  )
}
