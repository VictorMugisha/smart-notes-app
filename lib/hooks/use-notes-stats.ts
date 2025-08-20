"use client"

import { useMemo } from "react"
import { useNotesStore } from "@/lib/stores/notes-store"
import { useLabelsStore } from "@/lib/stores/labels-store"

export function useNotesStats() {
  const { notes } = useNotesStore()
  const { labels } = useLabelsStore()

  return useMemo(() => {
    const totalNotes = notes.length
    const totalWords = notes.reduce((acc, note) => {
      const wordCount = note.content
        .replace(/<[^>]*>/g, "")
        .split(/\s+/)
        .filter(Boolean).length
      return acc + wordCount
    }, 0)

    const notesWithLabels = notes.filter((note) => note.labelIds.length > 0).length
    const notesWithoutLabels = totalNotes - notesWithLabels

    const labelStats = labels
      .map((label) => ({
        ...label,
        noteCount: notes.filter((note) => note.labelIds.includes(label.id)).length,
      }))
      .sort((a, b) => b.noteCount - a.noteCount)

    const recentNotes = notes.filter((note) => Date.now() - note.updatedAt < 7 * 24 * 60 * 60 * 1000).length // Last 7 days

    return {
      totalNotes,
      totalWords,
      notesWithLabels,
      notesWithoutLabels,
      labelStats,
      recentNotes,
      averageWordsPerNote: totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0,
    }
  }, [notes, labels])
}
