import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface SearchFilters {
  dateRange: {
    start: Date | null
    end: Date | null
    type: "created" | "updated"
  }
  hasLabels: boolean | null // true = has labels, false = no labels, null = any
  wordCount: {
    min: number | null
    max: number | null
  }
}

interface SearchState {
  searchHistory: string[]
  recentSearches: string[]
  searchFilters: SearchFilters
  isAdvancedSearchOpen: boolean

  // Actions
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void
  removeFromSearchHistory: (query: string) => void
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  resetSearchFilters: () => void
  toggleAdvancedSearch: () => void
  setAdvancedSearchOpen: (open: boolean) => void
}

const defaultFilters: SearchFilters = {
  dateRange: {
    start: null,
    end: null,
    type: "updated",
  },
  hasLabels: null,
  wordCount: {
    min: null,
    max: null,
  },
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      searchHistory: [],
      recentSearches: [],
      searchFilters: defaultFilters,
      isAdvancedSearchOpen: false,

      addToSearchHistory: (query) => {
        if (!query.trim()) return

        set((state) => {
          const trimmedQuery = query.trim()
          const newHistory = [trimmedQuery, ...state.searchHistory.filter((q) => q !== trimmedQuery)].slice(0, 10)
          const newRecent = [trimmedQuery, ...state.recentSearches.filter((q) => q !== trimmedQuery)].slice(0, 5)

          return {
            searchHistory: newHistory,
            recentSearches: newRecent,
          }
        })
      },

      clearSearchHistory: () => {
        set({ searchHistory: [], recentSearches: [] })
      },

      removeFromSearchHistory: (query) => {
        set((state) => ({
          searchHistory: state.searchHistory.filter((q) => q !== query),
          recentSearches: state.recentSearches.filter((q) => q !== query),
        }))
      },

      setSearchFilters: (filters) => {
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters },
        }))
      },

      resetSearchFilters: () => {
        set({ searchFilters: defaultFilters })
      },

      toggleAdvancedSearch: () => {
        set((state) => ({ isAdvancedSearchOpen: !state.isAdvancedSearchOpen }))
      },

      setAdvancedSearchOpen: (open) => {
        set({ isAdvancedSearchOpen: open })
      },
    }),
    {
      name: "smart-notes-search-storage",
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        recentSearches: state.recentSearches,
      }),
    },
  ),
)
