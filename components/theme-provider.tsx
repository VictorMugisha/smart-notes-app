"use client"

import type React from "react"

import { useEffect } from "react"
import { useUIStore } from "@/lib/stores/ui-store"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore()

  useEffect(() => {
    const root = window.document.documentElement

    // Remove existing theme classes
    root.classList.remove("light", "dark")

    // Add new theme class with transition
    root.style.setProperty("--theme-transition", "all 0.3s ease-in-out")
    root.classList.add(theme)

    // Apply theme-specific meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#ffffff")
    } else {
      const meta = document.createElement("meta")
      meta.name = "theme-color"
      meta.content = theme === "dark" ? "#0a0a0a" : "#ffffff"
      document.head.appendChild(meta)
    }

    // Clean up transition after theme change
    const cleanup = setTimeout(() => {
      root.style.removeProperty("--theme-transition")
    }, 300)

    return () => clearTimeout(cleanup)
  }, [theme])

  return <>{children}</>
}
