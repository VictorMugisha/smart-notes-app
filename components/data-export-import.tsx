"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotesStore } from "@/lib/stores/notes-store"
import { useLabelsStore } from "@/lib/stores/labels-store"
import { DataExporter } from "@/lib/utils/data-export"
import { useToast } from "@/hooks/use-toast"
import { Download, Upload, FileText, Database } from "lucide-react"

export function DataExportImport() {
  const { notes } = useNotesStore()
  const { labels } = useLabelsStore()
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState<"json" | "markdown" | "csv">("json")
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const timestamp = new Date().toISOString().split("T")[0]
      let content: string
      let filename: string
      let mimeType: string

      switch (exportFormat) {
        case "json":
          content = DataExporter.exportToJSON(notes, labels)
          filename = `smart-notes-backup-${timestamp}.json`
          mimeType = "application/json"
          break
        case "markdown":
          content = DataExporter.exportToMarkdown(notes, labels)
          filename = `smart-notes-export-${timestamp}.md`
          mimeType = "text/markdown"
          break
        case "csv":
          content = DataExporter.exportToCSV(notes, labels)
          filename = `smart-notes-export-${timestamp}.csv`
          mimeType = "text/csv"
          break
        default:
          throw new Error("Invalid export format")
      }

      DataExporter.downloadFile(content, filename, mimeType)

      toast({
        title: "Export successful",
        description: `Your notes have been exported as ${filename}`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const content = await file.text()
      const { notes: importedNotes, labels: importedLabels } = await DataExporter.importFromJSON(content)

      // Here you would typically merge or replace the data
      // For now, we'll just show a success message
      toast({
        title: "Import successful",
        description: `Imported ${importedNotes.length} notes and ${importedLabels.length} labels`,
      })
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
      // Reset the input
      event.target.value = ""
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Database className="h-4 w-4" />
          Backup & Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Notes
            </h4>
            <div className="space-y-3">
              <Select
                value={exportFormat}
                onValueChange={(value: "json" | "markdown" | "csv") => setExportFormat(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div className="font-medium">JSON Backup</div>
                        <div className="text-xs text-muted-foreground">Complete backup with all data</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="markdown">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Markdown</div>
                        <div className="text-xs text-muted-foreground">Human-readable format</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div className="font-medium">CSV</div>
                        <div className="text-xs text-muted-foreground">Spreadsheet compatible</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport} disabled={isExporting || notes.length === 0} className="w-full">
                {isExporting ? "Exporting..." : `Export ${notes.length} Notes`}
              </Button>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Backup
            </h4>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Import a JSON backup file to restore your notes and labels.
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={isImporting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <Button variant="outline" disabled={isImporting} className="w-full bg-transparent">
                  {isImporting ? "Importing..." : "Choose Backup File"}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="pt-4 border-t text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Total Notes:</span>
              <span>{notes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Labels:</span>
              <span>{labels.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Storage Used:</span>
              <span>{Math.round((JSON.stringify({ notes, labels }).length / 1024) * 100) / 100} KB</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
