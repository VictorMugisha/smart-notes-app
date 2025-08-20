"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  ChevronDown,
  Undo,
  Redo,
} from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  onUnsavedChanges?: (hasChanges: boolean) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  content,
  onChange,
  onUnsavedChanges,
  placeholder = "Start writing your note...",
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFormatting, setIsFormatting] = useState(false)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
  const debounceRef = useRef<NodeJS.Timeout>()

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  // Handle content changes with debouncing
  const handleContentChange = useCallback(() => {
    if (!editorRef.current || isFormatting) return

    const newContent = editorRef.current.innerHTML
    if (newContent !== content) {
      onUnsavedChanges?.(true)

      // Debounce the onChange call
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        onChange(newContent)
        onUnsavedChanges?.(false)
      }, 500)
    }
  }, [content, onChange, onUnsavedChanges, isFormatting])

  // Update active formats based on cursor position
  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>()

    if (document.queryCommandState("bold")) formats.add("bold")
    if (document.queryCommandState("italic")) formats.add("italic")
    if (document.queryCommandState("underline")) formats.add("underline")
    if (document.queryCommandState("strikeThrough")) formats.add("strikethrough")
    if (document.queryCommandState("justifyLeft")) formats.add("alignLeft")
    if (document.queryCommandState("justifyCenter")) formats.add("alignCenter")
    if (document.queryCommandState("justifyRight")) formats.add("alignRight")
    if (document.queryCommandState("insertUnorderedList")) formats.add("bulletList")
    if (document.queryCommandState("insertOrderedList")) formats.add("numberedList")

    setActiveFormats(formats)
  }, [])

  // Execute formatting command
  const executeCommand = useCallback(
    (command: string, value?: string) => {
      setIsFormatting(true)
      document.execCommand(command, false, value)
      updateActiveFormats()
      editorRef.current?.focus()
      setIsFormatting(false)
      handleContentChange()
    },
    [updateActiveFormats, handleContentChange],
  )

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault()
            executeCommand("bold")
            break
          case "i":
            e.preventDefault()
            executeCommand("italic")
            break
          case "u":
            e.preventDefault()
            executeCommand("underline")
            break
          case "z":
            if (e.shiftKey) {
              e.preventDefault()
              executeCommand("redo")
            } else {
              e.preventDefault()
              executeCommand("undo")
            }
            break
        }
      }
    },
    [executeCommand],
  )

  // Handle selection change to update active formats
  useEffect(() => {
    const handleSelectionChange = () => {
      if (document.activeElement === editorRef.current) {
        updateActiveFormats()
      }
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    return () => document.removeEventListener("selectionchange", handleSelectionChange)
  }, [updateActiveFormats])

  return (
    <div className={cn("flex flex-col border rounded-lg bg-card", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
        {/* Heading Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              Heading
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => executeCommand("formatBlock", "p")}>Normal Text</DropdownMenuItem>
            <DropdownMenuItem onClick={() => executeCommand("formatBlock", "h1")}>
              <span className="text-2xl font-bold">Heading 1</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => executeCommand("formatBlock", "h2")}>
              <span className="text-xl font-bold">Heading 2</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => executeCommand("formatBlock", "h3")}>
              <span className="text-lg font-bold">Heading 3</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => executeCommand("formatBlock", "h4")}>
              <span className="text-base font-bold">Heading 4</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => executeCommand("formatBlock", "h5")}>
              <span className="text-sm font-bold">Heading 5</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => executeCommand("formatBlock", "h6")}>
              <span className="text-xs font-bold">Heading 6</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Formatting */}
        <Button
          variant={activeFormats.has("bold") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => executeCommand("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={activeFormats.has("italic") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => executeCommand("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={activeFormats.has("underline") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => executeCommand("underline")}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant={activeFormats.has("strikethrough") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => executeCommand("strikeThrough")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment */}
        <Button
          variant={activeFormats.has("alignLeft") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => executeCommand("justifyLeft")}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={activeFormats.has("alignCenter") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => executeCommand("justifyCenter")}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={activeFormats.has("alignRight") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => executeCommand("justifyRight")}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <Button
          variant={activeFormats.has("bulletList") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => executeCommand("insertUnorderedList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={activeFormats.has("numberedList") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => executeCommand("insertOrderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <Button variant="ghost" size="sm" onClick={() => executeCommand("undo")} title="Undo (Ctrl+Z)">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => executeCommand("redo")} title="Redo (Ctrl+Shift+Z)">
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "flex-1 p-4 min-h-[300px] outline-none",
          "prose prose-sm max-w-none",
          "focus:ring-0 focus:outline-none",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4",
          "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3",
          "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2",
          "[&_h4]:text-base [&_h4]:font-bold [&_h4]:mb-2",
          "[&_h5]:text-sm [&_h5]:font-bold [&_h5]:mb-1",
          "[&_h6]:text-xs [&_h6]:font-bold [&_h6]:mb-1",
          "[&_p]:mb-2 [&_p]:leading-relaxed",
          "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-2",
          "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-2",
          "[&_li]:mb-1",
          "[&_strong]:font-semibold",
          "[&_em]:italic",
          "[&_u]:underline",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none",
        )}
        data-placeholder={placeholder}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        onMouseUp={updateActiveFormats}
        onKeyUp={updateActiveFormats}
        suppressContentEditableWarning={true}
      />
    </div>
  )
}
