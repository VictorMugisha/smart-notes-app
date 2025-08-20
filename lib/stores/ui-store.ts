import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIState {
  theme: "light" | "dark"
  sidebarCollapsed: boolean
  searchQuery: string
  selectedLabelIds: string[]
  sortBy: "created" | "updated" | "title"
  sortOrder: "asc" | "desc"

  // Actions
  toggleTheme: () => void
  setTheme: (theme: "light" | "dark") => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSearchQuery: (query: string) => void
  setSelectedLabelIds: (labelIds: string[]) => void
  toggleLabelFilter: (labelId: string) => void
  setSortBy: (sortBy: "created" | "updated" | "title") => void
  setSortOrder: (order: "asc" | "desc") => void
  clearFilters: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "light",
      sidebarCollapsed: false,
      searchQuery: "",
      selectedLabelIds: [],
      sortBy: "updated",
      sortOrder: "desc",

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        }))
      },

      setTheme: (theme) => {
        set({ theme })
      },

      toggleSidebar: () => {
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        }))
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed })
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      setSelectedLabelIds: (labelIds) => {
        set({ selectedLabelIds: labelIds })
      },

      toggleLabelFilter: (labelId) => {
        set((state) => ({
          selectedLabelIds: state.selectedLabelIds.includes(labelId)
            ? state.selectedLabelIds.filter((id) => id !== labelId)
            : [...state.selectedLabelIds, labelId],
        }))
      },

      setSortBy: (sortBy) => {
        set({ sortBy })
      },

      setSortOrder: (order) => {
        set({ sortOrder: order })
      },

      clearFilters: () => {
        set({
          searchQuery: "",
          selectedLabelIds: [],
        })
      },
    }),
    {
      name: "smart-notes-ui-storage",
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    },
  ),
)
