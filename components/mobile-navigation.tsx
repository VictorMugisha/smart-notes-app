"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { Menu, Plus } from "lucide-react"
import { useNotesStore } from "@/lib/stores/notes-store"

export function MobileNavigation() {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const { createNote, setCurrentNote } = useNotesStore()

  const handleCreateNote = () => {
    const noteId = createNote()
    setCurrentNote(noteId)
    setIsOpen(false)
  }

  if (!isMobile) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between p-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-serif font-bold">Smart Notes</h1>

        <Button size="icon" onClick={handleCreateNote}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
