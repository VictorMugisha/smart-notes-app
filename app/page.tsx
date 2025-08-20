"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { NotesApp } from "@/components/notes-app"

export default function HomePage() {
  return (
    <ThemeProvider>
      <NotesApp />
    </ThemeProvider>
  )
}
