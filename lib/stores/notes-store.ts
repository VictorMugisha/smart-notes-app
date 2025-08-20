import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useLabelsStore } from "./labels-store"

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  labelIds: string[]
}

interface NotesState {
  notes: Note[]
  currentNoteId: string | null
  hasUnsavedChanges: boolean

  // Actions
  createNote: (title?: string) => string
  updateNote: (id: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => void
  deleteNote: (id: string) => void
  duplicateNote: (id: string) => string
  setCurrentNote: (id: string | null) => void
  setUnsavedChanges: (hasChanges: boolean) => void
  getNoteById: (id: string) => Note | undefined
  getNotesWithLabels: (labelIds: string[]) => Note[]
  searchNotes: (query: string) => Note[]
  searchNotesAdvanced: (
    query: string,
    options?: { includeLabels?: boolean; caseSensitive?: boolean; wholeWords?: boolean },
  ) => { notes: Note[]; highlights: Map<string, { title: string[]; content: string[] }> }
  filterNotesAdvanced: (filters: {
    dateRange?: { start?: Date; end?: Date; type?: "created" | "updated" }
    hasLabels?: boolean
    wordCount?: { min?: number; max?: number }
  }) => Note[]
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      currentNoteId: null,
      hasUnsavedChanges: false,

      createNote: (title = "Untitled Note") => {
        const id = crypto.randomUUID()
        const now = Date.now()
        const newNote: Note = {
          id,
          title,
          content: "",
          createdAt: now,
          updatedAt: now,
          labelIds: [],
        }

        set((state) => ({
          notes: [newNote, ...state.notes],
          currentNoteId: id,
          hasUnsavedChanges: false,
        }))

        return id
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note)),
          hasUnsavedChanges: false,
        }))
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          currentNoteId: state.currentNoteId === id ? null : state.currentNoteId,
          hasUnsavedChanges: false,
        }))
      },

      duplicateNote: (id) => {
        const originalNote = get().getNoteById(id)
        if (!originalNote) return ""

        const newId = crypto.randomUUID()
        const now = Date.now()
        const duplicatedNote: Note = {
          ...originalNote,
          id: newId,
          title: `${originalNote.title} (Copy)`,
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          notes: [duplicatedNote, ...state.notes],
        }))

        return newId
      },

      setCurrentNote: (id) => {
        set({ currentNoteId: id })
      },

      setUnsavedChanges: (hasChanges) => {
        set({ hasUnsavedChanges: hasChanges })
      },

      getNoteById: (id) => {
        return get().notes.find((note) => note.id === id)
      },

      getNotesWithLabels: (labelIds) => {
        if (labelIds.length === 0) return get().notes
        return get().notes.filter((note) => labelIds.some((labelId) => note.labelIds.includes(labelId)))
      },

      searchNotes: (query) => {
        if (!query.trim()) return get().notes
        const searchTerm = query.toLowerCase()
        return get().notes.filter(
          (note) => note.title.toLowerCase().includes(searchTerm) || note.content.toLowerCase().includes(searchTerm),
        )
      },

      searchNotesAdvanced: (query, options = {}) => {
        const { includeLabels = true, caseSensitive = false, wholeWords = false } = options
        if (!query.trim()) return { notes: get().notes, highlights: new Map() }

        const searchTerm = caseSensitive ? query.trim() : query.trim().toLowerCase()
        const highlights = new Map<string, { title: string[]; content: string[] }>()

        const filteredNotes = get().notes.filter((note) => {
          const title = caseSensitive ? note.title : note.title.toLowerCase()
          const content = caseSensitive
            ? note.content.replace(/<[^>]*>/g, "")
            : note.content.replace(/<[^>]*>/g, "").toLowerCase()

          let titleMatches: string[] = []
          let contentMatches: string[] = []

          // Search in title and content
          const titleMatch = title.includes(searchTerm)
          const contentMatch = content.includes(searchTerm)

          if (titleMatch) {
            titleMatches = extractMatches(title, searchTerm, wholeWords)
          }

          if (contentMatch) {
            contentMatches = extractMatches(content, searchTerm, wholeWords)
          }

          // Search in labels if enabled
          let labelMatch = false
          if (includeLabels) {
            const { getLabelsByIds } = useLabelsStore.getState()
            const noteLabels = getLabelsByIds(note.labelIds)
            labelMatch = noteLabels.some((label) =>
              caseSensitive ? label.name.includes(searchTerm) : label.name.toLowerCase().includes(searchTerm),
            )
          }

          const hasMatch = titleMatch || contentMatch || labelMatch

          if (hasMatch) {
            highlights.set(note.id, { title: titleMatches, content: contentMatches })
          }

          return hasMatch
        })

        return { notes: filteredNotes, highlights }
      },

      filterNotesAdvanced: (filters) => {
        let filteredNotes = get().notes

        // Date range filter
        if (filters.dateRange?.start || filters.dateRange?.end) {
          filteredNotes = filteredNotes.filter((note) => {
            const dateToCheck = filters.dateRange.type === "created" ? note.createdAt : note.updatedAt
            const noteDate = new Date(dateToCheck)

            if (filters.dateRange.start && noteDate < filters.dateRange.start) return false
            if (filters.dateRange.end && noteDate > filters.dateRange.end) return false

            return true
          })
        }

        // Labels filter
        if (filters.hasLabels !== null) {
          filteredNotes = filteredNotes.filter((note) => {
            const hasLabels = note.labelIds.length > 0
            return filters.hasLabels ? hasLabels : !hasLabels
          })
        }

        // Word count filter
        if (filters.wordCount?.min !== null || filters.wordCount?.max !== null) {
          filteredNotes = filteredNotes.filter((note) => {
            const wordCount = note.content
              .replace(/<[^>]*>/g, "")
              .split(/\s+/)
              .filter(Boolean).length

            if (filters.wordCount.min !== null && wordCount < filters.wordCount.min) return false
            if (filters.wordCount.max !== null && wordCount > filters.wordCount.max) return false

            return true
          })
        }

        return filteredNotes
      },
    }),
    {
      name: "smart-notes-storage",
      partialize: (state) => ({
        notes: state.notes,
      }),
    },
  ),
)

// Helper function to extract search matches for highlighting
function extractMatches(text: string, searchTerm: string, wholeWords: boolean): string[] {
  if (!searchTerm) return []

  const regex = wholeWords
    ? new RegExp(`\\b${escapeRegExp(searchTerm)}\\b`, "gi")
    : new RegExp(escapeRegExp(searchTerm), "gi")

  const matches = text.match(regex) || []
  return [...new Set(matches)] // Remove duplicates
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
