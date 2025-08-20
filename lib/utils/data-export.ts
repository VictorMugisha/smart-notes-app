import type { Note } from "@/lib/stores/notes-store"
import type { Label } from "@/lib/stores/labels-store"

export interface ExportData {
  notes: Note[]
  labels: Label[]
  exportedAt: string
  version: string
}

export class DataExporter {
  static exportToJSON(notes: Note[], labels: Label[]): string {
    const exportData: ExportData = {
      notes,
      labels,
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    }
    return JSON.stringify(exportData, null, 2)
  }

  static exportToMarkdown(notes: Note[], labels: Label[]): string {
    let markdown = "# Smart Notes Export\n\n"
    markdown += `Exported on: ${new Date().toLocaleDateString()}\n\n`

    // Group notes by labels
    const labelMap = new Map(labels.map((label) => [label.id, label]))
    const notesWithLabels = notes.map((note) => ({
      ...note,
      labelNames: note.labelIds.map((id) => labelMap.get(id)?.name).filter(Boolean),
    }))

    // Sort by creation date
    const sortedNotes = notesWithLabels.sort((a, b) => b.createdAt - a.createdAt)

    sortedNotes.forEach((note, index) => {
      markdown += `## ${note.title || `Untitled Note ${index + 1}`}\n\n`

      if (note.labelNames.length > 0) {
        markdown += `**Labels:** ${note.labelNames.join(", ")}\n\n`
      }

      markdown += `**Created:** ${new Date(note.createdAt).toLocaleDateString()}\n`
      markdown += `**Modified:** ${new Date(note.updatedAt).toLocaleDateString()}\n\n`

      // Convert HTML content to markdown-like format
      const content = note.content
        .replace(/<h([1-6])>/g, (_, level) => "#".repeat(Number.parseInt(level)) + " ")
        .replace(/<\/h[1-6]>/g, "\n\n")
        .replace(/<strong>/g, "**")
        .replace(/<\/strong>/g, "**")
        .replace(/<em>/g, "*")
        .replace(/<\/em>/g, "*")
        .replace(/<u>/g, "_")
        .replace(/<\/u>/g, "_")
        .replace(/<br\s*\/?>/g, "\n")
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "\n\n")
        .replace(/<ul>/g, "")
        .replace(/<\/ul>/g, "\n")
        .replace(/<ol>/g, "")
        .replace(/<\/ol>/g, "\n")
        .replace(/<li>/g, "- ")
        .replace(/<\/li>/g, "\n")
        .replace(/<[^>]*>/g, "") // Remove any remaining HTML tags
        .replace(/\n\n+/g, "\n\n") // Clean up multiple newlines
        .trim()

      markdown += content || "*(No content)*"
      markdown += "\n\n---\n\n"
    })

    return markdown
  }

  static exportToCSV(notes: Note[], labels: Label[]): string {
    const labelMap = new Map(labels.map((label) => [label.id, label]))
    const csvRows = [["Title", "Content", "Labels", "Created", "Modified", "Word Count"].join(",")]

    notes.forEach((note) => {
      const labelNames = note.labelIds.map((id) => labelMap.get(id)?.name).filter(Boolean)
      const plainContent = note.content.replace(/<[^>]*>/g, "").replace(/"/g, '""')
      const wordCount = plainContent.split(/\s+/).filter(Boolean).length

      const row = [
        `"${(note.title || "Untitled").replace(/"/g, '""')}"`,
        `"${plainContent}"`,
        `"${labelNames.join("; ")}"`,
        `"${new Date(note.createdAt).toISOString()}"`,
        `"${new Date(note.updatedAt).toISOString()}"`,
        wordCount.toString(),
      ]

      csvRows.push(row.join(","))
    })

    return csvRows.join("\n")
  }

  static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  static async importFromJSON(jsonString: string): Promise<{ notes: Note[]; labels: Label[] }> {
    try {
      const data = JSON.parse(jsonString) as ExportData

      // Validate data structure
      if (!data.notes || !Array.isArray(data.notes)) {
        throw new Error("Invalid notes data")
      }

      if (!data.labels || !Array.isArray(data.labels)) {
        throw new Error("Invalid labels data")
      }

      // Validate note structure
      const validNotes = data.notes.filter((note) => {
        return (
          typeof note.id === "string" &&
          typeof note.title === "string" &&
          typeof note.content === "string" &&
          typeof note.createdAt === "number" &&
          typeof note.updatedAt === "number" &&
          Array.isArray(note.labelIds)
        )
      })

      // Validate label structure
      const validLabels = data.labels.filter((label) => {
        return (
          typeof label.id === "string" &&
          typeof label.name === "string" &&
          typeof label.color === "string" &&
          typeof label.createdAt === "number"
        )
      })

      return { notes: validNotes, labels: validLabels }
    } catch (error) {
      throw new Error(`Failed to import data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}
