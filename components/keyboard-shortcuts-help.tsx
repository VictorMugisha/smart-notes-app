"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts"
import { Keyboard, Command } from "lucide-react"

export function KeyboardShortcutsHelp() {
  const { shortcuts } = useKeyboardShortcuts()
  const [isOpen, setIsOpen] = useState(false)

  const formatShortcut = (shortcut: any) => {
    const keys = []
    if (shortcut.ctrlKey || shortcut.metaKey) keys.push("Ctrl")
    if (shortcut.shiftKey) keys.push("Shift")
    if (shortcut.altKey) keys.push("Alt")
    keys.push(shortcut.key === " " ? "Space" : shortcut.key)
    return keys
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Keyboard className="h-4 w-4" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Use these keyboard shortcuts to navigate and manage your notes more efficiently.
          </div>

          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {formatShortcut(shortcut).map((key, keyIndex) => (
                    <Badge key={keyIndex} variant="secondary" className="text-xs px-2 py-1 font-mono">
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t text-xs text-muted-foreground">
            <p className="mb-2">
              <strong>Rich Text Editor Shortcuts:</strong>
            </p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Bold</span>
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs px-2 py-1 font-mono">
                    Ctrl
                  </Badge>
                  <Badge variant="secondary" className="text-xs px-2 py-1 font-mono">
                    B
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Italic</span>
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs px-2 py-1 font-mono">
                    Ctrl
                  </Badge>
                  <Badge variant="secondary" className="text-xs px-2 py-1 font-mono">
                    I
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Underline</span>
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs px-2 py-1 font-mono">
                    Ctrl
                  </Badge>
                  <Badge variant="secondary" className="text-xs px-2 py-1 font-mono">
                    U
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
