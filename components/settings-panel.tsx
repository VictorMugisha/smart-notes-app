"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataExportImport } from "@/components/data-export-import"
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help"
import { NotesStats } from "@/components/notes-stats"
import { useUIStore } from "@/lib/stores/ui-store"
import { Settings, Palette, Database, Keyboard, BarChart3 } from "lucide-react"

export function SettingsPanel() {
  const { theme, setTheme, sortBy, setSortBy, sortOrder, setSortOrder } = useUIStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <div className="text-sm text-muted-foreground">Choose your preferred color scheme</div>
                </div>
                <Select value={theme} onValueChange={(value: "light" | "dark") => setTheme(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes Organization */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes Organization</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Default Sort By</Label>
                  <div className="text-sm text-muted-foreground">How notes are sorted by default</div>
                </div>
                <Select value={sortBy} onValueChange={(value: "created" | "updated" | "title") => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated">Last Modified</SelectItem>
                    <SelectItem value="created">Date Created</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sort Order</Label>
                  <div className="text-sm text-muted-foreground">Ascending or descending order</div>
                </div>
                <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistics
            </h3>
            <NotesStats />
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </h3>
            <div className="flex flex-wrap gap-2">
              <DataExportImport />
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </h3>
            <div className="flex flex-wrap gap-2">
              <KeyboardShortcutsHelp />
            </div>
          </div>

          {/* About */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">About Smart Notes</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>A comprehensive note-taking application with rich text editing, labeling, and powerful search.</p>
              <div className="flex items-center justify-between">
                <span>Version:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Built with:</span>
                <span>React, Next.js, Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
