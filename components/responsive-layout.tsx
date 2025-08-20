"use client"

import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useUIStore } from "@/lib/stores/ui-store"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { cn } from "@/lib/utils"

export function ResponsiveLayout() {
  const isMobile = useIsMobile()
  const { sidebarCollapsed } = useUIStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-80 border-r border-sidebar-border bg-sidebar animate-pulse" />
        <div className="flex-1 bg-background animate-pulse" />
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <MobileNavigation />
        <div className="flex-1 pt-16 overflow-hidden">
          <MainContent />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out border-r border-sidebar-border bg-sidebar",
          sidebarCollapsed ? "w-16" : "w-80",
        )}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <MainContent />
      </div>
    </div>
  )
}
